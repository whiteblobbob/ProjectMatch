import "server-only";

import { createHash } from "node:crypto";

import { ActionError } from "./errors";

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export type UploadKind = "avatar" | "verification-document";

const FOLDER_BY_KIND: Record<UploadKind, string> = {
  avatar: "avatars",
  "verification-document": "verification-documents",
};

type CloudinaryConfig = {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
};

type CloudinaryUploadResponse = {
  public_id?: string;
  format?: string;
  resource_type?: string;
};

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const JPEG_SIGNATURE = [0xff, 0xd8, 0xff];

export function getCloudinaryConfig(): CloudinaryConfig {
  const value = process.env.CLOUDINARY_URL;

  if (!value) {
    throw new ActionError("Unggah file belum dikonfigurasi.");
  }

  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw new ActionError("Konfigurasi Cloudinary tidak valid.");
  }

  const cloudName = url.hostname;
  const apiKey = decodeURIComponent(url.username);
  const apiSecret = decodeURIComponent(url.password);

  if (url.protocol !== "cloudinary:" || !cloudName || !apiKey || !apiSecret) {
    throw new ActionError("Konfigurasi Cloudinary tidak valid.");
  }

  return { cloudName, apiKey, apiSecret };
}

export function getCloudinaryCloudName(): string {
  try {
    return getCloudinaryConfig().cloudName;
  } catch {
    return "";
  }
}

export function detectImageFormat(bytes: Uint8Array): "png" | "jpeg" | null {
  if (PNG_SIGNATURE.every((byte, index) => bytes[index] === byte)) {
    return "png";
  }

  if (JPEG_SIGNATURE.every((byte, index) => bytes[index] === byte)) {
    return "jpeg";
  }

  return null;
}

function uploadError(field: "avatar" | "document", message: string) {
  return new ActionError(message, { [field]: [message] });
}

export async function assertPngOrJpeg(file: File, field: "avatar" | "document") {
  const label = field === "avatar" ? "foto" : "dokumen";

  if (!(file instanceof File) || file.size === 0) {
    throw uploadError(field, `Pilih ${label} yang akan diunggah.`);
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    throw uploadError(field, `Ukuran ${label} maksimal 5 MB.`);
  }

  if (file.type !== "image/png" && file.type !== "image/jpeg") {
    throw uploadError(field, `Format ${label} harus JPG atau PNG.`);
  }

  const header = new Uint8Array(await file.slice(0, 8).arrayBuffer());
  const format = detectImageFormat(header);

  if (!format) {
    throw uploadError(field, `Format ${label} harus JPG atau PNG.`);
  }

  return format;
}

export function buildSignature(params: Record<string, string | number>, apiSecret: string) {
  const toSign = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return createHash("sha1").update(`${toSign}${apiSecret}`).digest("hex");
}

export async function uploadImage(
  file: File,
  { userId, kind }: { userId: string; kind: UploadKind },
): Promise<string> {
  const format = await assertPngOrJpeg(file, kind === "avatar" ? "avatar" : "document");
  const config = getCloudinaryConfig();
  const folder = `projectmatch/${FOLDER_BY_KIND[kind]}/${userId}`;
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = buildSignature({ folder, timestamp }, config.apiSecret);

  const body = new FormData();
  body.append("file", file);
  body.append("api_key", config.apiKey);
  body.append("timestamp", String(timestamp));
  body.append("folder", folder);
  body.append("signature", signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`,
    { method: "POST", body },
  );
  const result = (await response.json().catch(() => null)) as CloudinaryUploadResponse | null;

  if (!response.ok) {
    console.error("[cloudinary] upload rejected", response.status, result);

    if (response.status === 401 || response.status === 403) {
      throw new ActionError("Unggah file belum dikonfigurasi dengan benar. Hubungi admin.");
    }

    throw new ActionError("File gagal diunggah. Coba lagi.");
  }

  const publicId = result?.public_id;
  const allowedFormats = format === "png" ? ["png"] : ["jpg", "jpeg"];

  if (
    !publicId ||
    !allowedFormats.includes(String(result?.format).toLowerCase()) ||
    !publicId.startsWith(`${folder}/`)
  ) {
    console.error("[cloudinary] upload returned an unexpected asset", response.status, result);
    throw new ActionError("File gagal diunggah. Coba lagi.");
  }

  return publicId;
}

export async function destroyImage(publicId: string) {
  try {
    const config = getCloudinaryConfig();
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = buildSignature({ public_id: publicId, timestamp }, config.apiSecret);

    const body = new FormData();
    body.append("public_id", publicId);
    body.append("api_key", config.apiKey);
    body.append("timestamp", String(timestamp));
    body.append("signature", signature);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${config.cloudName}/image/destroy`,
      { method: "POST", body },
    );

    if (!response.ok) {
      console.error("[cloudinary] failed to destroy asset", response.status);
    }
  } catch (error) {
    console.error("[cloudinary] failed to destroy asset", error);
  }
}

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ActionError } from "../errors";
import {
  MAX_UPLOAD_BYTES,
  assertPngOrJpeg,
  buildSignature,
  detectImageFormat,
  getCloudinaryConfig,
  uploadImage,
} from "../cloudinary";
import { cloudinaryAvatarUrl } from "../ui/cloudinary";

const PNG_BYTES = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00]);
const JPEG_BYTES = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46]);

function pngFile(size = PNG_BYTES.length) {
  return new File([size === PNG_BYTES.length ? PNG_BYTES : new Uint8Array(size)], "avatar.png", {
    type: "image/png",
  });
}

const fetchMock = vi.fn();

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
  fetchMock.mockReset();
  process.env.CLOUDINARY_URL = "cloudinary://test-key:test-secret@test-cloud";
  fetchMock.mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({
      public_id: "projectmatch/avatars/test-user-id/avatar",
      format: "png",
    }),
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("detectImageFormat", () => {
  it("detects the PNG signature", () => {
    expect(detectImageFormat(PNG_BYTES)).toBe("png");
  });

  it("detects the JPEG signature", () => {
    expect(detectImageFormat(JPEG_BYTES)).toBe("jpeg");
  });

  it("rejects PDF and plain text bytes", () => {
    expect(detectImageFormat(new Uint8Array([0x25, 0x50, 0x44, 0x46]))).toBeNull();
    expect(detectImageFormat(new TextEncoder().encode("hello world"))).toBeNull();
  });
});

describe("getCloudinaryConfig", () => {
  it("parses the cloud name, API key, and API secret from CLOUDINARY_URL", () => {
    expect(getCloudinaryConfig()).toEqual({
      cloudName: "test-cloud",
      apiKey: "test-key",
      apiSecret: "test-secret",
    });
  });

  it("throws when CLOUDINARY_URL is missing", () => {
    delete process.env.CLOUDINARY_URL;

    expect(() => getCloudinaryConfig()).toThrow(ActionError);
  });

  it("throws when CLOUDINARY_URL is not a cloudinary URL", () => {
    process.env.CLOUDINARY_URL = "https://example.com";

    expect(() => getCloudinaryConfig()).toThrow(ActionError);
  });
});

describe("assertPngOrJpeg", () => {
  it("accepts a PNG file", async () => {
    await expect(assertPngOrJpeg(pngFile(), "avatar")).resolves.toBe("png");
  });

  it("accepts a JPEG file", async () => {
    const file = new File([JPEG_BYTES], "photo.jpg", { type: "image/jpeg" });

    await expect(assertPngOrJpeg(file, "document")).resolves.toBe("jpeg");
  });

  it("rejects a non-image MIME type", async () => {
    const file = new File([PNG_BYTES], "document.pdf", { type: "application/pdf" });

    await expect(assertPngOrJpeg(file, "document")).rejects.toMatchObject({
      fieldErrors: { document: ["Format dokumen harus JPG atau PNG."] },
    });
  });

  it("rejects spoofed MIME types whose bytes are not PNG/JPEG", async () => {
    const file = new File([new TextEncoder().encode("not an image")], "fake.png", {
      type: "image/png",
    });

    await expect(assertPngOrJpeg(file, "avatar")).rejects.toMatchObject({
      fieldErrors: { avatar: ["Format foto harus JPG atau PNG."] },
    });
  });

  it("rejects files larger than 5 MB", async () => {
    const file = pngFile(MAX_UPLOAD_BYTES + 1);

    await expect(assertPngOrJpeg(file, "document")).rejects.toMatchObject({
      fieldErrors: { document: ["Ukuran dokumen maksimal 5 MB."] },
    });
  });

  it("rejects empty files", async () => {
    const file = new File([], "empty.png", { type: "image/png" });

    await expect(assertPngOrJpeg(file, "avatar")).rejects.toMatchObject({
      fieldErrors: { avatar: ["Pilih foto yang akan diunggah."] },
    });
  });
});

describe("cloudinaryAvatarUrl", () => {
  it("builds a delivery URL from the public id and cloud name", () => {
    const url = cloudinaryAvatarUrl("projectmatch/avatars/test-user-id/avatar", "test-cloud");

    expect(url).toContain("https://res.cloudinary.com/test-cloud/image/upload");
    expect(url).toContain("projectmatch/avatars/test-user-id/avatar");
  });
});

describe("uploadImage", () => {
  it("signs an upload scoped to the user and returns the public id", async () => {
    const file = pngFile();

    const publicId = await uploadImage(file, { userId: "test-user-id", kind: "avatar" });

    expect(publicId).toBe("projectmatch/avatars/test-user-id/avatar");
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.cloudinary.com/v1_1/test-cloud/image/upload");

    const body = options.body as FormData;
    const folder = String(body.get("folder"));
    const timestamp = String(body.get("timestamp"));

    expect(folder).toBe("projectmatch/avatars/test-user-id");
    expect(body.get("api_key")).toBe("test-key");
    expect(body.get("signature")).toBe(buildSignature({ folder, timestamp }, "test-secret"));
  });

  it("stores verification documents in their own folder", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        public_id: "projectmatch/verification-documents/test-user-id/card",
        format: "png",
      }),
    });

    const publicId = await uploadImage(pngFile(), {
      userId: "test-user-id",
      kind: "verification-document",
    });

    const body = fetchMock.mock.calls[0][1].body as FormData;
    expect(body.get("folder")).toBe("projectmatch/verification-documents/test-user-id");
    expect(publicId).toBe("projectmatch/verification-documents/test-user-id/card");
  });

  it("rejects a non-PNG/JPEG asset reported by Cloudinary", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        public_id: "projectmatch/avatars/test-user-id/avatar",
        format: "webp",
      }),
    });

    await expect(uploadImage(pngFile(), { userId: "test-user-id", kind: "avatar" })).rejects.toThrow(
      "File gagal diunggah. Coba lagi.",
    );
  });

  it("rejects an asset that was not stored in the user's folder", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        public_id: "projectmatch/avatars/another-user/avatar",
        format: "png",
      }),
    });

    await expect(uploadImage(pngFile(), { userId: "test-user-id", kind: "avatar" })).rejects.toThrow(
      "File gagal diunggah. Coba lagi.",
    );
  });

  it("surfaces a configuration error when Cloudinary rejects the credentials", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 403,
      json: async () => ({ error: { message: "missing permissions" } }),
    });

    await expect(uploadImage(pngFile(), { userId: "test-user-id", kind: "avatar" })).rejects.toThrow(
      "Unggah file belum dikonfigurasi dengan benar. Hubungi admin.",
    );
  });

  it("rejects a failed Cloudinary response", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ error: { message: "Server error" } }),
    });

    await expect(uploadImage(pngFile(), { userId: "test-user-id", kind: "avatar" })).rejects.toThrow(
      "File gagal diunggah. Coba lagi.",
    );
  });
});

"use server";

import { randomBytes } from "node:crypto";
import { headers } from "next/headers";
import { Resend } from "resend";
import { User } from "@supabase/supabase-js";
import { Prisma } from "@/generated/prisma/client";

import actionWrapper from "../lib/actionWrapper";
import { uploadImage } from "../lib/cloudinary";
import { verificationEmail } from "../lib/email/verification-email";
import { ActionError } from "../lib/errors";
import prisma from "../lib/prisma";
import { SendVerificationForm, SendVerificationValidator } from "../lib/validator/auth";
import { VerificationDocumentForm, VerificationDocumentValidator } from "../lib/validator/verification";
import { parseOrThrow } from "../lib/validator/global";

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

/**
 * Send an academic-email verification link to the given address. The token is
 * single-use and expires after 24 hours; clicking the link flips the user's
 * `verified` flag via the verify-email route handler.
 */
export const sendVerificationEmail = actionWrapper(async (user: User, formData: SendVerificationForm) => {
  const data = parseOrThrow(SendVerificationValidator, formData);

  const account = await prisma.user.findUnique({
    where: { id: user.id },
    select: { verified: true },
  });

  if (account?.verified) {
    throw new ActionError("Akun sudah terverifikasi.");
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new ActionError("Verifikasi email belum dikonfigurasi.");
  }

  const token = randomBytes(32).toString("hex");

  await prisma.user.update({
    where: { id: user.id },
    data: {
      verificationToken: token,
      verificationTokenExpiresAt: new Date(Date.now() + TOKEN_TTL_MS),
    },
  });

  const headerList = await headers();
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ?? `http://${headerList.get("host") ?? "localhost:3000"}`;
  const verifyUrl = `${origin}/api/auth/verify-email?token=${token}`;
  const { subject, html } = verificationEmail(verifyUrl);

  const { error } = await new Resend(apiKey).emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "ProjectMatch <onboarding@resend.dev>",
    to: data.email,
    subject,
    html,
  });

  if (error) {
    // Resend messages are developer-facing; log them and keep the user message generic.
    console.error("[resend] failed to send verification email", error);
    throw new ActionError("Gagal mengirim email verifikasi. Coba lagi nanti.");
  }

  return { email: data.email };
}, { auth: true });

/**
 * Store a document-verification submission for manual admin review. The
 * account stays unverified until an admin approves it.
 */
export const submitVerificationDocument = actionWrapper(async (user: User, formData: VerificationDocumentForm) => {
  const data = parseOrThrow(VerificationDocumentValidator, formData);

  const account = await prisma.user.findUnique({
    where: { id: user.id },
    select: { verified: true },
  });

  if (account?.verified) {
    throw new ActionError("Akun sudah terverifikasi.");
  }

  const pendingDocument = await prisma.verificationDocument.findFirst({
    where: { userId: user.id },
    select: { id: true },
  });

  if (pendingDocument) {
    throw new ActionError("Dokumen verifikasi sedang ditinjau admin.");
  }

  const documentCloudId = await uploadImage(data.document, {
    userId: user.id,
    kind: "verification-document",
  });

  try {
    await prisma.verificationDocument.create({
      data: {
        userId: user.id,
        documentCloudId,
        documentType: data.documentType,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new ActionError("Dokumen verifikasi sedang ditinjau admin.");
    }

    throw error;
  }

  return { documentCloudId };
}, { auth: true });

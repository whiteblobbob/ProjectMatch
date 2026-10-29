type VerificationEmail = {
  subject: string;
  html: string;
};

/**
 * Build the academic-email verification message. Kept as a plain string
 * template so no extra email-rendering dependency is required.
 */
export function verificationEmail(verifyUrl: string): VerificationEmail {
  return {
    subject: "Verifikasi email akademik ProjectMatch",
    html: `<!doctype html>
<html lang="id">
  <body style="margin:0;background:#f8fafc;font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:#0f172a;">
    <div style="max-width:520px;margin:0 auto;padding:32px 20px;">
      <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;padding:28px;">
        <p style="margin:0;font-size:12px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:#2563eb;">ProjectMatch</p>
        <h1 style="margin:12px 0 0;font-size:22px;line-height:1.3;">Verifikasi email akademikmu</h1>
        <p style="margin:16px 0 0;font-size:14px;line-height:1.7;color:#475569;">
          Terima kasih telah mendaftar. Untuk menandai akunmu sebagai pelajar atau mahasiswa terverifikasi, klik tombol di bawah ini.
        </p>
        <a href="${verifyUrl}" style="display:inline-block;margin-top:20px;padding:12px 22px;background:#2563eb;border-radius:12px;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;">Verifikasi email</a>
        <p style="margin:20px 0 0;font-size:12px;line-height:1.6;color:#94a3b8;">
          Tautan ini berlaku 24 jam. Jika kamu tidak meminta verifikasi ini, abaikan email ini.
        </p>
        <p style="margin:16px 0 0;font-size:12px;line-height:1.6;color:#94a3b8;word-break:break-all;">
          Atau salin tautan berikut ke peramban:<br />${verifyUrl}
        </p>
      </div>
    </div>
  </body>
</html>`,
  };
}

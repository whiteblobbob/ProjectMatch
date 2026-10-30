import PasswordRecoveryCard from "../components/auth/password-recovery-card";
import PasswordRecoveryForm from "../components/auth/password-recovery-form";

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <PasswordRecoveryCard title="Lupa kata sandi?" description="Masukkan email akunmu untuk menerima tautan pemulihan kata sandi.">
      <PasswordRecoveryForm mode="forgot" invalidLink={error === "invalid_reset_link"} />
    </PasswordRecoveryCard>
  );
}

import PasswordRecoveryCard from "../components/auth/password-recovery-card";
import PasswordRecoveryForm from "../components/auth/password-recovery-form";
import { requireSessionUser } from "../lib/ui/session";

export default async function ResetPasswordPage() {
  await requireSessionUser();

  return (
    <PasswordRecoveryCard title="Atur kata sandi baru" description="Gunakan kata sandi baru dengan minimal 8 karakter untuk akunmu.">
      <PasswordRecoveryForm mode="reset" />
    </PasswordRecoveryCard>
  );
}

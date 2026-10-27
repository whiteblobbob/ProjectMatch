export const DEMO_SESSION_COOKIE = "projectmatch-demo-session";
export const DEMO_PROFILE_COOKIE = "projectmatch-demo-profile";
export const DEMO_USER_ID = "projectmatch-demo-user";

export function isDemoAccountEnabled() {
  return process.env.NODE_ENV !== "production" && process.env.ENABLE_DEMO_ACCOUNT === "true";
}

export function isDemoCredential(email: string, password: string) {
  return (
    isDemoAccountEnabled() &&
    Boolean(process.env.DEMO_ACCOUNT_EMAIL) &&
    Boolean(process.env.DEMO_ACCOUNT_PASSWORD) &&
    email === process.env.DEMO_ACCOUNT_EMAIL &&
    password === process.env.DEMO_ACCOUNT_PASSWORD
  );
}

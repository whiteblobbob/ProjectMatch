import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({
  cookieStore: new Map<string, string>(),
  setCookie: vi.fn(),
  fetch: vi.fn(),
}));

vi.mock("next/headers", () => ({
  cookies: async () => ({
    getAll: () => Array.from(mocks.cookieStore, ([name, value]) => ({ name, value })),
    set: (name: string, value: string, options: unknown) => {
      mocks.cookieStore.set(name, value);
      mocks.setCookie(name, value, options);
    },
  }),
}));

let GET: typeof import("../../api/reset-password/route").GET;
const verifierKey = "sb-recovery-auth-token-code-verifier";

beforeAll(async () => {
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://recovery.supabase.co");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "test-publishable-key");
  vi.stubGlobal("fetch", mocks.fetch);
  ({ GET } = await import("../../api/reset-password/route"));
});

beforeEach(() => {
  vi.clearAllMocks();
  mocks.cookieStore.clear();
  mocks.cookieStore.set(verifierKey, JSON.stringify("test-verifier/recovery"));
  mocks.fetch.mockResolvedValue(new Response(JSON.stringify({
    access_token: "test-access-token",
    refresh_token: "test-refresh-token",
    token_type: "bearer",
    expires_in: 3600,
    user: { id: "recovered-user", email: "user@example.com" },
  }), { status: 200, headers: { "Content-Type": "application/json" } }));
});

afterAll(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("password recovery callback", () => {
  it("exchanges a code using the PKCE cookie and persists session cookies before redirecting", async () => {
    const response = await GET(new NextRequest("https://app.example/api/reset-password?code=valid-code&next=https://other.example"));

    expect(response.headers.get("location")).toBe("https://app.example/reset-password");
    expect(mocks.fetch).toHaveBeenCalledWith(
      "https://recovery.supabase.co/auth/v1/token?grant_type=pkce",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ auth_code: "valid-code", code_verifier: "test-verifier" }),
      }),
    );
    expect(mocks.setCookie).toHaveBeenCalledWith("sb-recovery-auth-token", expect.any(String), expect.objectContaining({ path: "/" }));
    expect(mocks.setCookie).toHaveBeenCalledWith(verifierKey, "", expect.objectContaining({ maxAge: 0 }));
  });

  it.each(["", "?code=", "?error=access_denied&error_description=private-details"]) (
    "rejects missing codes and provider failures without exposing diagnostics: %s",
    async (query) => {
      const response = await GET(new NextRequest(`https://app.example/api/reset-password${query}`));
      expect(response.headers.get("location")).toBe("https://app.example/forgot-password?error=invalid_reset_link");
      expect(mocks.fetch).not.toHaveBeenCalled();
    },
  );

  it("rejects a code when its browser verifier is missing", async () => {
    mocks.cookieStore.clear();
    const response = await GET(new NextRequest("https://app.example/api/reset-password?code=valid-code"));
    expect(response.headers.get("location")).toBe("https://app.example/forgot-password?error=invalid_reset_link");
    expect(mocks.fetch).not.toHaveBeenCalled();
  });

  it.each(["expired", "reused", "invalid"])("handles %s codes without creating a session", async (code) => {
    mocks.fetch.mockResolvedValue(new Response(JSON.stringify({
      code: "bad_code_verifier",
      msg: "Private provider diagnostics",
    }), { status: 400, headers: { "Content-Type": "application/json" } }));

    const response = await GET(new NextRequest(`https://app.example/api/reset-password?code=${code}`));
    expect(response.headers.get("location")).toBe("https://app.example/forgot-password?error=invalid_reset_link");
    expect(mocks.cookieStore.has("sb-recovery-auth-token")).toBe(false);
  });

  it("handles an unexpected exchange failure with a safe redirect", async () => {
    mocks.cookieStore.set(verifierKey, "base64-invalid-cookie");
    const response = await GET(new NextRequest("https://app.example/api/reset-password?code=valid-code"));
    expect(response.headers.get("location")).toBe("https://app.example/forgot-password?error=invalid_reset_link");
  });
});

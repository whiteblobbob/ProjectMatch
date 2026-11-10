import { defineConfig } from "vitest/config";
import path from "node:path";
import { loadEnv } from "vite";

export default defineConfig({
  test: {
    include: ["app/lib/test/**/*.ts"],
    env: loadEnv('development', process.cwd(), ''),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname),
      "server-only": path.resolve(__dirname, "vitest.stubs/server-only.ts"),
    },
  },
});

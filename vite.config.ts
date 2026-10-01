import solidPlugin from "@solidjs/vite-plugin"
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin"
import { playwright } from "@vitest/browser-playwright"
import { defineConfig } from "vitest/config"
import pkg from "./package.json" with { type: "json" }

// Positioning, focus trapping and outside clicks need real layout and input, which jsdom lacks. Vitest names the
// instances in place, so each project gets its own object.
const browser = () => ({
  enabled: true,
  headless: true,
  provider: playwright(),
  instances: [{ browser: "chromium" as const }],
  screenshotFailures: false,
})

export default defineConfig({
  plugins: [solidPlugin()],
  // Vite reloads the page when it finds a dependency to prebundle mid-run, which can fail the test that was running.
  // The cache is always cold in the Nix check, so every dependency is prebundled up front.
  optimizeDeps: {
    include: Object.keys(pkg.dependencies),
  },
  resolve: {
    conditions: ["development", "browser"],
  },
  test: {
    globals: true,
    // Bloom has no components yet
    passWithNoTests: true,
    projects: [
      {
        extends: true,
        test: {
          name: "components",
          include: ["tests/**/*.test.tsx"],
          setupFiles: "./vitest.setup.ts",
          browser: browser(),
        },
      },
      {
        // Every story is a test: it renders, and its `play` function runs
        extends: true,
        plugins: [storybookTest({ configDir: ".storybook" })],
        test: {
          name: "stories",
          browser: browser(),
        },
      },
      {
        extends: true,
        test: {
          name: "bundle",
          include: ["tests/**/*.test.ts"],
          environment: "node",
        },
      },
    ],
  },
})

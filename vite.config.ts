import solidPlugin from "@solidjs/vite-plugin"
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin"
import tailwindcss from "@tailwindcss/vite"
import { playwright } from "@vitest/browser-playwright"
import { defineConfig } from "vitest/config"
import pkg from "./package.json" with { type: "json" }
import seeds from "@foliag/seeds/package.json" with { type: "json" }

// Seeds has no root entry, only one subpath per component, and Fontsource packages are CSS and font files with no
// script, so neither can be prebundled by name
const seedsEntries = Object.keys(seeds.exports)
  .filter((subpath) => subpath !== "./package.json")
  .map((subpath) => `@foliag/seeds/${subpath.slice(2)}`)
const scriptDependencies = Object.keys(pkg.dependencies).filter(
  (name) => name !== "@foliag/seeds" && !name.startsWith("@fontsource"),
)

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
  plugins: [solidPlugin(), tailwindcss()],
  // Vite reloads the page when it finds a dependency to prebundle mid-run, which can fail the test that was running.
  // The cache is always cold in the Nix check, so every dependency is prebundled up front.
  optimizeDeps: {
    include: [...scriptDependencies, ...seedsEntries],
  },
  resolve: {
    conditions: ["development", "browser"],
  },
  test: {
    globals: true,
    // Everything so far is tested through its stories, so the components and bundle projects have no files yet
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

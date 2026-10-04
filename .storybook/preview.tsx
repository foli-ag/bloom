import { createDecorator, type Preview } from "storybook-solidjs-vite"
import { themes } from "storybook/theming"
import "./preview.css"

// The three switches an app can offer its users, and the three the system sets for them. Each writes the attribute
// that theme.css reads on <html>, so a story shows what a farmer with that setting would see.
const withUserSettings = createDecorator((Story, context) => {
  const root = document.documentElement
  const { theme, contrast, motion } = context.globals
  setAttribute(root, "data-theme", theme === "system" ? undefined : theme)
  setAttribute(root, "data-contrast", contrast === "system" ? undefined : contrast)
  setAttribute(root, "data-motion", motion === "system" ? undefined : motion)
  return Story()
})

function setAttribute(element: HTMLElement, name: string, value: string | undefined) {
  if (value === undefined) element.removeAttribute(name)
  else element.setAttribute(name, value)
}

export default {
  decorators: [withUserSettings],
  globalTypes: {
    theme: {
      description: "Theme",
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        items: [
          { value: "system", title: "System" },
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
    contrast: {
      description: "Contrast",
      toolbar: {
        title: "Contrast",
        icon: "contrast",
        items: [
          { value: "system", title: "System" },
          { value: "normal", title: "Normal" },
          { value: "more", title: "More contrast" },
        ],
        dynamicTitle: true,
      },
    },
    motion: {
      description: "Motion",
      toolbar: {
        title: "Motion",
        icon: "play",
        items: [
          { value: "system", title: "System" },
          { value: "full", title: "Full motion" },
          { value: "reduced", title: "Reduced motion" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: "system", contrast: "system", motion: "system" },
  parameters: {
    // storybook-dark-mode themes the manager only. Docs pages take a fixed theme, so they follow the system setting
    // as it is when the page loads.
    docs: { theme: matchMedia("(prefers-color-scheme: dark)").matches ? themes.dark : themes.light },
    layout: "centered",
    // axe runs on every story, and a violation fails the story in the test run. AAA contrast (7:1) is off by default
    // in axe, and bloom promises it.
    a11y: { test: "error", config: { rules: [{ id: "color-contrast-enhanced", enabled: true }] } },
  },
} satisfies Preview

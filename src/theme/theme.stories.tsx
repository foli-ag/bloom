import { createSignal } from "solid-js"
import { expect, userEvent, waitFor, within } from "storybook/test"
import type { Meta, StoryObj } from "storybook-solidjs-vite"
import { Badge } from "../badge/index.js"
import { Button } from "../button/index.js"
import { Checkbox } from "../checkbox/index.js"
import { withSetting } from "../foundations/contrast.js"
import { Switch } from "../switch/index.js"
import { type Theme, ThemeProvider } from "./index.js"

const meta = {
  title: "Foundations/Theme",
  component: ThemeProvider,
  parameters: { layout: "padded" },
} satisfies Meta<typeof ThemeProvider>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Another company's navy, from its logo, `#1a3a6b`. It is dark, so it carries white ink and its hover and press go
 * darker where the green's go lighter. Text and edges take the scale's steps as they take the green's: 800 for text
 * and 700 for edges in the light theme, 300 and 400 in the dark one.
 */
const acme: Theme = {
  "primary-50": "#f2f7ff",
  "primary-100": "#e5efff",
  "primary-200": "#cbe0ff",
  "primary-300": "#acccfe",
  "primary-400": "#91b6ee",
  "primary-500": "#7ba0d9",
  "primary-600": "#6687bb",
  "primary-700": "#4d6c9c",
  "primary-800": "#344d74",
  "primary-900": "#233652",
  "primary-950": "#131f32",
  primary: "#1a3a6b",
  "on-primary": "#fff",
  "primary-hover": "#0f2f5f",
  "primary-pressed": "#042352",
  "primary-soft": { light: "#e5efff", dark: "#1f2733" },
}

/** The same components in bloom's green and in a theme, switched while the page is open */
export const Rebrand: Story = {
  render: () => {
    const [branded, setBranded] = createSignal(true)
    return (
      <ThemeProvider theme={branded() ? acme : undefined}>
        <section class="grid max-w-md gap-4">
          <Switch checked={branded()} onCheckedChange={(details) => setBranded(details.checked)}>
            Couleurs d'Acme
          </Switch>
          <div class="flex flex-wrap gap-3">
            <Button>Enregistrer</Button>
            <Button variant="soft">Brouillon</Button>
            <Button variant="outline">Annuler</Button>
          </div>
          <Checkbox defaultChecked>
            <Checkbox.Label>Agriculture biologique</Checkbox.Label>
          </Checkbox>
          <p class="flex items-center gap-3">
            <Badge>Semé</Badge>
            <span class="font-semibold text-primary-text">12,4 ha irrigués</span>
          </p>
        </section>
      </ThemeProvider>
    )
  },
}

export const TestRebrandInDarkTheme: Story = {
  ...Rebrand,
  name: "Test: Rebrand in dark theme",
  globals: { theme: "dark" },
}

export const TestRebrandWithMoreContrast: Story = {
  ...Rebrand,
  name: "Test: Rebrand with more contrast",
  globals: { contrast: "more" },
}

/** A theme reaches every component as it changes, and without one bloom's green is back */
export const TestSwitchingTheme: Story = {
  ...Rebrand,
  name: "Test: Switching theme",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const save = canvas.getByRole("button", { name: "Enregistrer" })
    const fill = () => getComputedStyle(save).backgroundColor
    await waitFor(() => expect(fill()).toBe("rgb(26, 58, 107)"))
    expect(getComputedStyle(save).color).toBe("rgb(255, 255, 255)")
    await userEvent.click(canvas.getByRole("switch", { name: "Couleurs d'Acme" }))
    await waitFor(() => expect(fill()).toBe("rgb(116, 178, 76)"))
    expect(document.querySelector("style[data-scope=theme]")).toBeNull()
  },
}

/**
 * The theme takes the place of theme.css's values, not of the farmer's settings: with more contrast, primary text
 * turns to the theme's 900 even where the theme sets a lighter one of its own
 */
export const TestMoreContrastWinsOverTheme: Story = {
  name: "Test: More contrast wins over the theme",
  render: () => (
    <ThemeProvider theme={{ ...acme, "primary-text": "#4d6c9c" }}>
      <span data-testid="probe" class="text-primary-text" />
    </ThemeProvider>
  ),
  play: ({ canvasElement }) => {
    const probe = within(canvasElement).getByTestId("probe")
    const paint = () => getComputedStyle(probe).color
    expect(withSetting({ theme: "light", contrast: "normal" }, paint)).toBe("rgb(77, 108, 156)")
    expect(withSetting({ theme: "light", contrast: "more" }, paint)).toBe("rgb(35, 54, 82)")
  },
}

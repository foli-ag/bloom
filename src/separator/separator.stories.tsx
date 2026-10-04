import { expect, within } from "storybook/test"
import type { Meta, StoryObj } from "storybook-solidjs-vite"
import { Button } from "../button/index.js"
import { Separator } from "./index.js"

const meta = {
  title: "Components/Separator",
  component: Separator,
  tags: ["autodocs"],
  decorators: [(Story) => <div class="grid w-80 gap-4">{Story()}</div>],
} satisfies Meta<typeof Separator>

export default meta
type Story = StoryObj<typeof meta>

/** A line across. Its props are in the Controls panel. */
export const Playground: Story = {
  argTypes: {
    orientation: { control: "inline-radio", options: ["horizontal", "vertical"] },
    decorative: { control: "boolean" },
    children: { control: "text" },
  },
}

/** "ou" between two ways to sign in, with the line on both sides of it */
export const WithWords: Story = {
  render: () => (
    <>
      <Button tone="neutral" variant="outline" block>
        Continuer avec un code reçu par SMS
      </Button>
      <Separator>ou</Separator>
      <Button block>Se connecter avec un mot de passe</Button>
    </>
  ),
}

/** Down, between things in a row: it takes the row's height */
export const Vertical: Story = {
  render: () => (
    <div class="flex min-h-12 items-center gap-3">
      <span>12,4 ha</span>
      <Separator orientation="vertical" decorative />
      <span>Blé tendre</span>
      <Separator orientation="vertical" decorative />
      <span>Semé</span>
    </div>
  ),
}

/** A separator is announced, with its words as its name; a decorative one is left out, its words read where they stand */
export const TestWhatAScreenReaderGets: Story = {
  name: "Test: What a screen reader gets",
  render: () => (
    <>
      <Separator>ou</Separator>
      <Separator orientation="vertical" />
      <Separator decorative>et</Separator>
    </>
  ),
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const [across, down] = canvas.getAllByRole("separator")
    expect(across).toHaveAccessibleName("ou")
    expect(across).not.toHaveAttribute("aria-orientation")
    expect(down).toHaveAttribute("aria-orientation", "vertical")
    expect(canvas.getAllByRole("separator")).toHaveLength(2)
    expect(canvas.getByText("et")).toBeVisible()
  },
}

export const TestWithWordsInDarkTheme: Story = {
  ...WithWords,
  name: "Test: With words in dark theme",
  globals: { theme: "dark" },
}

export const TestWithWordsWithMoreContrast: Story = {
  ...WithWords,
  name: "Test: With words with more contrast",
  globals: { contrast: "more" },
}

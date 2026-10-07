import { expect, fn, spyOn, userEvent, waitFor, within } from "storybook/test"
import type { Meta, StoryObj } from "storybook-solidjs-vite"
import { Button } from "../button/index.js"
import { Clipboard } from "./index.js"

const link = "https://foli.ag/invitation/7KQ2-MOISSON"

function InviteLink(props: Partial<Clipboard.RootProps>) {
  return (
    <Clipboard.Root defaultValue={link} class="w-[min(24rem,90vw)]" {...props}>
      <Clipboard.Label>Lien d'invitation pour un saisonnier</Clipboard.Label>
      <Clipboard.Control>
        <Clipboard.Input />
        <Clipboard.Trigger as={Button} variant="outline">
          <Clipboard.Indicator copied="Copié">Copier</Clipboard.Indicator>
        </Clipboard.Trigger>
      </Clipboard.Control>
    </Clipboard.Root>
  )
}

// The test browser has no clipboard to write to, so the stories that press Copy catch the write. The others leave it
// alone, which lets the Playground copy for real.
function catchClipboardWrite() {
  const writeText = spyOn(navigator.clipboard, "writeText").mockResolvedValue(undefined)
  return () => writeText.mockRestore()
}

const meta = {
  title: "Components/Clipboard",
  component: InviteLink,
  tags: ["autodocs"],
  args: { onStatusChange: fn() },
} satisfies Meta<typeof InviteLink>

export default meta
type Story = StoryObj<typeof meta>

/**
 * The link reads in a field that cannot be typed in, with a button that copies it. Its props are in the Controls
 * panel.
 */
export const Playground: Story = {
  args: { value: link },
  argTypes: {
    value: { control: "text" },
    timeout: { control: "number" },
  },
}

/** A short code reads as text, without a field around it */
export const AsText: Story = {
  render: () => (
    <Clipboard.Root defaultValue="FR-34-0127" class="w-80">
      <Clipboard.Label>Numéro PACAGE</Clipboard.Label>
      <Clipboard.Control class="items-center">
        <Clipboard.ValueText />
        <Clipboard.Trigger as={Button} variant="ghost">
          <Clipboard.Indicator copied="Copié">Copier</Clipboard.Indicator>
        </Clipboard.Trigger>
      </Clipboard.Control>
    </Clipboard.Root>
  ),
}

/**
 * The link reads in a field that cannot be typed in. The button copies it and says so in its own words for a moment,
 * named by them and not by zag's English "Copy to clipboard", then goes back. The field keeps its width throughout.
 */
export const TestCopyingTheLink: Story = {
  name: "Test: Copying the link",
  args: { timeout: 800 },
  beforeEach: catchClipboardWrite,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const field = canvas.getByRole("textbox", { name: "Lien d'invitation pour un saisonnier" })
    expect(field).toHaveValue(link)
    expect(field).toHaveAttribute("readonly")
    const width = field.getBoundingClientRect().width

    await userEvent.click(canvas.getByRole("button", { name: "Copier" }))
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(link)
    expect(args.onStatusChange).toHaveBeenCalledWith({ copied: true })
    expect(await canvas.findByRole("button", { name: "Copié" })).toBeVisible()
    // The words and the sheets give way to "Copié" and a tick, from the trigger's `data-copied`
    const trigger = canvas.getByRole("button", { name: "Copié" })
    await waitFor(() => expect(within(trigger).getByText("Copié")).toBeVisible())
    await waitFor(() => expect(within(trigger).getByText("Copier")).not.toBeVisible())
    expect(field.getBoundingClientRect().width).toBe(width)
    await waitFor(() => expect(canvas.getByRole("button", { name: "Copier" })).toBeVisible(), { timeout: 2000 })
  },
}

/** Just copied, to be measured by axe and looked at */
export const TestJustCopied: Story = {
  name: "Test: Just copied",
  args: { timeout: 60_000 },
  beforeEach: catchClipboardWrite,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Copier" }))
    await canvas.findByRole("button", { name: "Copié" })
  },
}

export const TestInDarkTheme: Story = {
  name: "Test: In dark theme",
  globals: { theme: "dark" },
}

export const TestWithMoreContrast: Story = {
  name: "Test: With more contrast",
  globals: { contrast: "more" },
}

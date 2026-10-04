import { expect, fn, spyOn, userEvent, waitFor, within } from "storybook/test"
import type { Meta, StoryObj } from "storybook-solidjs-vite"
import { Button } from "../button/index.js"
import { Clipboard } from "./index.js"

const link = "https://foli.ag/invitation/7KQ2-MOISSON"

function InviteLink(props: Partial<Clipboard.RootProps>) {
  return (
    <Clipboard.Root defaultValue={link} class="w-96 max-w-full" {...props}>
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

const meta = {
  title: "Components/Clipboard",
  component: InviteLink,
  tags: ["autodocs"],
  args: { onStatusChange: fn() },
  // The test browser has no clipboard to write to, so the write is caught here
  beforeEach: () => {
    const writeText = spyOn(navigator.clipboard, "writeText").mockResolvedValue(undefined)
    return () => writeText.mockRestore()
  },
} satisfies Meta<typeof InviteLink>

export default meta
type Story = StoryObj<typeof meta>

/**
 * The link reads in a field that cannot be typed in. The button copies it and says so in its own words for a moment,
 * named by them and not by zag's English "Copy to clipboard", then goes back.
 */
export const Default: Story = {
  args: { timeout: 800 },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const field = canvas.getByRole("textbox", { name: "Lien d'invitation pour un saisonnier" })
    expect(field).toHaveValue(link)
    expect(field).toHaveAttribute("readonly")

    await userEvent.click(canvas.getByRole("button", { name: "Copier" }))
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(link)
    expect(args.onStatusChange).toHaveBeenCalledWith({ copied: true })
    expect(await canvas.findByRole("button", { name: "Copié" })).toBeVisible()
    await waitFor(() => expect(canvas.getByRole("button", { name: "Copier" })).toBeVisible(), { timeout: 2000 })
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

/** Just copied, to be measured by axe and looked at */
export const Copied: Story = {
  args: { timeout: 60_000 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Copier" }))
    await canvas.findByRole("button", { name: "Copié" })
  },
}

export const InDarkTheme: Story = {
  globals: { theme: "dark" },
}

export const WithMoreContrast: Story = {
  globals: { contrast: "more" },
}

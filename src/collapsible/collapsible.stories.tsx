import { expect, fn, userEvent, waitFor, within } from "storybook/test"
import type { Meta, StoryObj } from "storybook-solidjs-vite"
import { Collapsible } from "./index.js"

function ParcelDetails(props: Collapsible.RootProps) {
  return (
    <Collapsible.Root class="w-80" {...props}>
      <Collapsible.Trigger>Détails de la parcelle</Collapsible.Trigger>
      <Collapsible.Content>
        <p class="pt-2">
          Sol limoneux, drainé en 2021. Dernier labour le 12 mars, semis de blé prévu la semaine suivante.
        </p>
      </Collapsible.Content>
    </Collapsible.Root>
  )
}

const meta = {
  title: "Components/Collapsible",
  component: ParcelDetails,
  tags: ["autodocs"],
  args: { onOpenChange: fn() },
} satisfies Meta<typeof ParcelDetails>

export default meta
type Story = StoryObj<typeof meta>

/**
 * The button is announced as expanded or collapsed, and the content grows to its height as the chevron turns. Its props
 * are in the Controls panel.
 */
export const Playground: Story = {
  argTypes: {
    disabled: { control: "boolean" },
  },
}

export const Open: Story = {
  args: { defaultOpen: true },
}

export const Disabled: Story = {
  args: { disabled: true },
}

/**
 * The button is announced as expanded or collapsed. The content grows to its height as the chevron turns, and folds
 * back the same way. Under reduced motion it only fades.
 */
export const TestOpeningAndClosing: Story = {
  name: "Test: Opening and closing",
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole("button", { name: "Détails de la parcelle" })
    expect(trigger).toHaveAttribute("aria-expanded", "false")
    expect(canvas.getByText(/Sol limoneux/)).not.toBeVisible()
    await userEvent.click(trigger)
    expect(trigger).toHaveAttribute("aria-expanded", "true")
    // It fades in as it grows, so it is visible once the animation has run
    await waitFor(() => expect(canvas.getByText(/Sol limoneux/)).toBeVisible())
    await waitFor(() =>
      expect(canvas.getByText(/Sol limoneux/).parentElement!.getBoundingClientRect().height).toBeGreaterThan(40),
    )
    expect(args.onOpenChange).toHaveBeenLastCalledWith({ open: true })
    await userEvent.keyboard("{Enter}")
    await waitFor(() => expect(canvas.getByText(/Sol limoneux/)).not.toBeVisible())
  },
}

/** With reduced motion the content is at its full height at once, and only fades in. */
export const TestWithReducedMotion: Story = {
  name: "Test: With reduced motion",
  globals: { motion: "reduced" },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: "Détails de la parcelle" }))
    const content = canvasElement.querySelector<HTMLElement>("[data-part=content]")!
    expect(getComputedStyle(content).animationName).toBe("bloom-fade-in")
  },
}

export const TestInDarkTheme: Story = {
  name: "Test: In dark theme",
  globals: { theme: "dark" },
  args: { defaultOpen: true },
}

export const TestWithMoreContrast: Story = {
  name: "Test: With more contrast",
  globals: { contrast: "more" },
  args: { defaultOpen: true },
}

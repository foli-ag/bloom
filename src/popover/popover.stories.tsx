import { expect, fn, userEvent, waitFor, within } from "storybook/test"
import type { Meta, StoryObj } from "storybook-solidjs-vite"
import { Button } from "../button/index.js"
import { settled } from "../foundations/settled.js"
import { Popover } from "./index.js"

function DoseHelp(props: Popover.RootProps) {
  return (
    <Popover.Root {...props}>
      <Popover.Trigger as={Button} variant="ghost">
        Comment est calculée la dose ?
      </Popover.Trigger>
      <Popover.Positioner>
        <Popover.Content>
          <Popover.Title>Dose d'azote</Popover.Title>
          <Popover.Description>
            Le besoin de la culture pour le rendement visé, moins ce que le sol fournit d'ici la récolte.
          </Popover.Description>
          <Popover.Actions>
            <Popover.Trigger.Close as={Button} tone="neutral" variant="outline">
              Fermer
            </Popover.Trigger.Close>
          </Popover.Actions>
        </Popover.Content>
      </Popover.Positioner>
    </Popover.Root>
  )
}

const placements = [
  "top",
  "top-start",
  "top-end",
  "right",
  "right-start",
  "right-end",
  "bottom",
  "bottom-start",
  "bottom-end",
  "left",
  "left-start",
  "left-end",
] as const satisfies readonly NonNullable<Popover.PositioningOptions["placement"]>[]

const meta = {
  title: "Components/Popover",
  component: DoseHelp,
  tags: ["autodocs"],
  args: { onOpenChange: fn() },
} satisfies Meta<typeof DoseHelp>

export default meta
type Story = StoryObj<typeof meta>

/** A small panel that hangs under its trigger, which is announced as expanded. Its props are in the Controls panel. */
export const Playground: Story = {
  args: { modal: false, autoFocus: true, closeOnEscape: true, closeOnInteractOutside: true, restoreFocus: true },
  argTypes: {
    modal: { control: "boolean" },
    autoFocus: { control: "boolean" },
    closeOnEscape: { control: "boolean" },
    closeOnInteractOutside: { control: "boolean" },
    restoreFocus: { control: "boolean" },
    // `positioning` is an object: the select picks its `placement`
    positioning: {
      name: "positioning.placement",
      control: "select",
      options: placements,
      mapping: Object.fromEntries(placements.map((placement) => [placement, { placement }])),
    },
  },
}

export const Open: Story = {
  args: { defaultOpen: true },
  play: settled,
}

/**
 * It hangs under its trigger, which is announced as expanded. Its close is named by its own words, not by the
 * English label zag gives it, and sends focus back to the trigger.
 */
export const TestOpeningAndClosing: Story = {
  name: "Test: Opening and closing",
  play: async ({ args }) => {
    const page = within(document.body)
    const trigger = page.getByRole("button", { name: "Comment est calculée la dose ?" })
    await userEvent.click(trigger)
    expect(trigger).toHaveAttribute("aria-expanded", "true")
    const popover = await page.findByRole("dialog", { name: "Dose d'azote" })
    await settled()
    expect(popover.getBoundingClientRect().top).toBeGreaterThan(trigger.getBoundingClientRect().bottom)

    await userEvent.click(page.getByRole("button", { name: "Fermer" }))
    await waitFor(() => expect(page.queryByRole("dialog")).toBeNull())
    expect(trigger).toHaveFocus()
    expect(args.onOpenChange).toHaveBeenLastCalledWith({ open: false })
  },
}

/** On a phone it rises from the bottom as a sheet over a dim, and a tap on the dim closes it. */
export const TestOnAPhone: Story = {
  name: "Test: On a phone",
  globals: { viewport: { value: "mobile2", isRotated: false } },
  play: async () => {
    const page = within(document.body)
    const trigger = page.getByRole("button", { name: "Comment est calculée la dose ?" })
    await userEvent.click(trigger)
    const popover = await page.findByRole("dialog")
    await settled()
    const sheet = popover.getBoundingClientRect()
    expect(sheet.bottom).toBeCloseTo(innerHeight, 0)
    expect(sheet.width).toBeCloseTo(innerWidth, 0)

    await userEvent.click(popover.parentElement!)
    await waitFor(() => expect(page.queryByRole("dialog")).toBeNull())
    // The content stays mounted, hidden, and the dim goes with it: a finger on the trigger reaches the trigger
    await settled()
    const { left, top, width, height } = trigger.getBoundingClientRect()
    expect(trigger.contains(document.elementFromPoint(left + width / 2, top + height / 2))).toBe(true)
  },
}

export const TestOpenInDarkTheme: Story = {
  name: "Test: Open in dark theme",
  ...Open,
  globals: { theme: "dark" },
}

export const TestOpenWithMoreContrast: Story = {
  name: "Test: Open with more contrast",
  ...Open,
  globals: { contrast: "more" },
}

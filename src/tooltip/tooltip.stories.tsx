import { expect, userEvent, waitFor, within } from "storybook/test"
import type { Meta, StoryObj } from "storybook-solidjs-vite"
import { Button } from "../button/index.js"
import { settled } from "../foundations/settled.js"
import { Tooltip } from "./index.js"

function Export(props: Tooltip.RootProps) {
  return (
    <div class="p-16">
      <Tooltip.Root openDelay={300} {...props}>
        <Tooltip.Trigger as={Button} variant="outline">
          Exporter
        </Tooltip.Trigger>
        <Tooltip.Positioner>
          <Tooltip.Content>
            <Tooltip.Arrow>
              <Tooltip.Arrow.Tip />
            </Tooltip.Arrow>
            Au format de la déclaration PAC
          </Tooltip.Content>
        </Tooltip.Positioner>
      </Tooltip.Root>
    </div>
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
] as const satisfies readonly NonNullable<Tooltip.PositioningOptions["placement"]>[]

const meta = {
  title: "Components/Tooltip",
  component: Export,
  tags: ["autodocs"],
} satisfies Meta<typeof Export>

export default meta
type Story = StoryObj<typeof meta>

/**
 * A few words that describe the button, shown after a moment when a mouse rests on it and at once when the keyboard
 * reaches it. Its props are in the Controls panel.
 */
export const Playground: Story = {
  args: {
    disabled: false,
    openDelay: 300,
    closeDelay: 150,
    closeOnClick: true,
    closeOnEscape: true,
    closeOnScroll: true,
    interactive: false,
  },
  argTypes: {
    disabled: { control: "boolean" },
    openDelay: { control: { type: "number", min: 0, step: 50 } },
    closeDelay: { control: { type: "number", min: 0, step: 50 } },
    closeOnClick: { control: "boolean" },
    closeOnEscape: { control: "boolean" },
    closeOnScroll: { control: "boolean" },
    interactive: { control: "boolean" },
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
 * Along a row of buttons, the first tooltip waits for the mouse to rest. Once one shows, moving to the next button
 * swaps the words at once, with no wait and no fade, as the eye is already there.
 */
export const InARow: Story = {
  render: () => (
    <div class="flex gap-3 p-16">
      <Tooltip.Root openDelay={300}>
        <Tooltip.Trigger as={Button} variant="outline">
          Exporter
        </Tooltip.Trigger>
        <Tooltip.Positioner>
          <Tooltip.Content>Au format de la déclaration PAC</Tooltip.Content>
        </Tooltip.Positioner>
      </Tooltip.Root>
      <Tooltip.Root openDelay={300}>
        <Tooltip.Trigger as={Button} variant="outline">
          Imprimer
        </Tooltip.Trigger>
        <Tooltip.Positioner>
          <Tooltip.Content>Une page par parcelle</Tooltip.Content>
        </Tooltip.Positioner>
      </Tooltip.Root>
    </div>
  ),
}

/**
 * The keyboard reaching the button shows it at once, as the button's description. Escape hides it and focus stays on
 * the button.
 */
export const TestWithTheKeyboard: Story = {
  name: "Test: With the keyboard",
  play: async () => {
    const page = within(document.body)
    const trigger = page.getByRole("button", { name: "Exporter" })
    await userEvent.tab()
    expect(trigger).toHaveFocus()
    expect(await page.findByRole("tooltip")).toHaveTextContent("Au format de la déclaration PAC")
    expect(trigger).toHaveAccessibleDescription("Au format de la déclaration PAC")

    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(page.queryByRole("tooltip")).toBeNull())
    expect(trigger).toHaveFocus()
  },
}

/** A mouse resting on the button shows it after a moment, under the button without covering it, and leaving hides it */
export const TestWithAMouse: Story = {
  name: "Test: With a mouse",
  play: async () => {
    const page = within(document.body)
    const trigger = page.getByRole("button", { name: "Exporter" })
    await userEvent.hover(trigger)
    const tooltip = await page.findByRole("tooltip")
    await settled()
    expect(tooltip.getBoundingClientRect().top).toBeGreaterThanOrEqual(trigger.getBoundingClientRect().bottom)

    await userEvent.unhover(trigger)
    await waitFor(() => expect(page.queryByRole("tooltip")).toBeNull())
  },
}

/** A finger never shows it: zag ignores touch, so on a phone it is never seen */
export const TestNotOnTouch: Story = {
  name: "Test: Not on touch",
  play: async () => {
    const page = within(document.body)
    const trigger = page.getByRole("button", { name: "Exporter" })
    const init = { bubbles: true, pointerId: 1, pointerType: "touch", isPrimary: true }
    trigger.dispatchEvent(new PointerEvent("pointerenter", init))
    trigger.dispatchEvent(new PointerEvent("pointermove", init))
    await new Promise((resolve) => setTimeout(resolve, 600))
    expect(page.queryByRole("tooltip")).toBeNull()
  },
}

/** Once a tooltip shows, the next button's replaces it on the spot: whole at once, and the first one gone */
export const TestMovingAlongARow: Story = {
  ...InARow,
  name: "Test: Moving along a row",
  play: async () => {
    const page = within(document.body)
    await userEvent.hover(page.getByRole("button", { name: "Exporter" }))
    await page.findByRole("tooltip")
    await settled()

    const print = page.getByRole("button", { name: "Imprimer" })
    await userEvent.hover(print)
    await waitFor(() => expect(print).toHaveAccessibleDescription("Une page par parcelle"))
    await new Promise(requestAnimationFrame)
    await new Promise(requestAnimationFrame)
    const tooltips = page.getAllByRole("tooltip")
    expect(tooltips).toHaveLength(1)
    expect(getComputedStyle(tooltips[0]!).opacity).toBe("1")
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

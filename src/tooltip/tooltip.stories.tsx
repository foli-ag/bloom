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

const meta = {
  title: "Components/Tooltip",
  component: Export,
  tags: ["autodocs"],
} satisfies Meta<typeof Export>

export default meta
type Story = StoryObj<typeof meta>

/**
 * The keyboard reaching the button shows it at once, as the button's description. Escape hides it and focus stays on
 * the button.
 */
export const Default: Story = {
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
export const WithAMouse: Story = {
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
export const NotOnTouch: Story = {
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

export const Open: Story = {
  args: { defaultOpen: true },
  play: settled,
}

export const OpenInDarkTheme: Story = {
  ...Open,
  globals: { theme: "dark" },
}

export const OpenWithMoreContrast: Story = {
  ...Open,
  globals: { contrast: "more" },
}

import { expect, userEvent, waitFor, within } from "storybook/test"
import type { Meta, StoryObj } from "storybook-solidjs-vite"
import { settled } from "../foundations/settled.js"
import { HoverCard } from "./index.js"

function Parcel(props: HoverCard.RootProps) {
  return (
    <p class="p-16">
      Dernière intervention sur{" "}
      <HoverCard.Root openDelay={300} closeDelay={150} {...props}>
        <HoverCard.Trigger as="a" href="#grands-champs" class="font-semibold text-primary-text underline focus-ring">
          Les Grands Champs
        </HoverCard.Trigger>
        <HoverCard.Positioner>
          <HoverCard.Content>
            <HoverCard.Arrow>
              <HoverCard.Arrow.Tip />
            </HoverCard.Arrow>
            <p class="font-semibold">Les Grands Champs</p>
            <p class="text-muted">Blé tendre, 12,4 ha, semé le 14 octobre</p>
          </HoverCard.Content>
        </HoverCard.Positioner>
      </HoverCard.Root>
      , hier.
    </p>
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
] as const satisfies readonly NonNullable<HoverCard.PositioningOptions["placement"]>[]

const meta = {
  title: "Components/HoverCard",
  component: Parcel,
  tags: ["autodocs"],
} satisfies Meta<typeof Parcel>

export default meta
type Story = StoryObj<typeof meta>

/**
 * A card about a parcel, shown under its name once a mouse has rested on it or the keyboard reaches it. Its props are
 * in the Controls panel.
 */
export const Playground: Story = {
  args: { disabled: false, openDelay: 300, closeDelay: 150 },
  argTypes: {
    disabled: { control: "boolean" },
    openDelay: { control: { type: "number", min: 0, step: 50 } },
    closeDelay: { control: { type: "number", min: 0, step: 50 } },
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
 * A mouse resting on the parcel's name shows its card under it, and the card stays while the pointer moves onto it.
 * Leaving both hides it.
 */
export const TestWithAMouse: Story = {
  name: "Test: With a mouse",
  play: async () => {
    const page = within(document.body)
    const link = page.getByRole("link", { name: "Les Grands Champs" })
    await userEvent.hover(link)
    const details = await page.findByText("Blé tendre, 12,4 ha, semé le 14 octobre")
    await settled()
    expect(details.parentElement!.getBoundingClientRect().top).toBeGreaterThanOrEqual(
      link.getBoundingClientRect().bottom,
    )

    await userEvent.hover(details)
    await new Promise((resolve) => setTimeout(resolve, 300))
    expect(details).toBeVisible()

    await userEvent.unhover(details)
    await waitFor(() => expect(page.queryByText("Blé tendre, 12,4 ha, semé le 14 octobre")).toBeNull())
  },
}

/** The keyboard reaching the link shows the card too, and leaving the link hides it */
export const TestWithTheKeyboard: Story = {
  name: "Test: With the keyboard",
  play: async () => {
    const page = within(document.body)
    await userEvent.tab()
    expect(page.getByRole("link", { name: "Les Grands Champs" })).toHaveFocus()
    await page.findByText("Blé tendre, 12,4 ha, semé le 14 octobre")
    await userEvent.tab()
    await waitFor(() => expect(page.queryByText("Blé tendre, 12,4 ha, semé le 14 octobre")).toBeNull())
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

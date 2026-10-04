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

const meta = {
  title: "Components/HoverCard",
  component: Parcel,
  tags: ["autodocs"],
} satisfies Meta<typeof Parcel>

export default meta
type Story = StoryObj<typeof meta>

/**
 * A mouse resting on the parcel's name shows its card under it, and the card stays while the pointer moves onto it.
 * Leaving both hides it.
 */
export const Default: Story = {
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
export const WithTheKeyboard: Story = {
  play: async () => {
    const page = within(document.body)
    await userEvent.tab()
    expect(page.getByRole("link", { name: "Les Grands Champs" })).toHaveFocus()
    await page.findByText("Blé tendre, 12,4 ha, semé le 14 octobre")
    await userEvent.tab()
    await waitFor(() => expect(page.queryByText("Blé tendre, 12,4 ha, semé le 14 octobre")).toBeNull())
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

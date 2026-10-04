import { Show } from "solid-js"
import { expect, fn, userEvent, waitFor, within } from "storybook/test"
import type { Meta, StoryObj } from "storybook-solidjs-vite"
import { Collapsible } from "./index.js"

function ParcelDetails(props: Collapsible.RootProps) {
  return (
    <Collapsible.Root class="w-80" {...props}>
      <Show
        when={props.variant === "card"}
        fallback={<Collapsible.Trigger>Détails de la parcelle</Collapsible.Trigger>}
      >
        <Collapsible.Trigger>
          Détails de la parcelle
          <Collapsible.Description>Les Grands Champs, 12,4 ha</Collapsible.Description>
        </Collapsible.Trigger>
      </Show>
      <Collapsible.Content>
        <p class={props.variant === "card" ? undefined : "pt-2"}>
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
  // Pinned to the top, as on a page: centred, the button would rise by half of what the content grows
  parameters: { layout: "padded" },
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
    variant: { control: "inline-radio", options: ["plain", "card"] },
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
 * Drawn as a card: its first row is the button, with a title, a line under it and the chevron at the end, and what it
 * shows is the card's body. The spacing is a `Card`'s.
 */
export const Card: Story = {
  args: { variant: "card" },
}

export const CardOpen: Story = {
  args: { variant: "card", defaultOpen: true },
}

export const CardDisabled: Story = {
  args: { variant: "card", disabled: true },
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
    // Reached from the keyboard, it shows its ring at once
    await userEvent.tab()
    expect(trigger).toHaveFocus()
    expect(getComputedStyle(trigger).outlineStyle).toBe("solid")
    expect(ringTransitions(trigger)).toEqual([])
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

/**
 * Closed again before it has finished opening, the content folds back from the height it had reached. It does not
 * jump to its full height first, as an animation that restarts from the open look would.
 */
export const TestChangingItsMindHalfWay: Story = {
  name: "Test: Changing its mind half way",
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("button", { name: "Détails de la parcelle" })
    const content = canvasElement.querySelector<HTMLElement>("[data-part=content]")!
    trigger.click()
    await waitFor(() => expect(content.getBoundingClientRect().height).toBeGreaterThan(20))
    const reached = content.getBoundingClientRect().height
    trigger.click()
    const heights = await sample(() => content.getBoundingClientRect().height, 500)
    expect(Math.max(...heights)).toBeLessThan(reached + 20)
    await waitFor(() => expect(content).not.toBeVisible())
  },
}

/** With reduced motion the content is at its full height at once, and only fades in: nothing moves. */
export const TestWithReducedMotion: Story = {
  name: "Test: With reduced motion",
  globals: { motion: "reduced" },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: "Détails de la parcelle" }))
    const content = canvasElement.querySelector<HTMLElement>("[data-part=content]")!
    const transitioned = content.getAnimations().map((animation) => (animation as CSSTransition).transitionProperty)
    expect(transitioned.filter(Boolean)).toEqual(["opacity"])
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

/**
 * The card's whole first row is the button, and its line under the title is read with it. It opens in the card,
 * whose edge grows down around what it shows, and its ring is drawn inside the card at once.
 */
export const TestCardOpeningAndClosing: Story = {
  name: "Test: Card opening and closing",
  args: { variant: "card" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const card = canvasElement.querySelector<HTMLElement>("[data-scope=collapsible][data-part=root]")!
    const trigger = canvas.getByRole("button", { name: "Détails de la parcelle Les Grands Champs, 12,4 ha" })
    // The row spans the card, and is a target of at least 56px
    expect(trigger.getBoundingClientRect().width).toBeCloseTo(card.clientWidth, 0)
    expect(trigger.getBoundingClientRect().height).toBeGreaterThanOrEqual(56)
    await userEvent.tab()
    const ring = getComputedStyle(trigger)
    expect(ring.outlineStyle).toBe("solid")
    expect(Number.parseFloat(ring.outlineOffset) + Number.parseFloat(ring.outlineWidth)).toBeLessThanOrEqual(0)
    expect(ringTransitions(trigger)).toEqual([])
    const closed = card.getBoundingClientRect().height
    await userEvent.keyboard("{Enter}")
    const text = canvas.getByText(/Sol limoneux/)
    await waitFor(() => expect(text).toBeVisible())
    await waitFor(() => expect(card.getBoundingClientRect().height).toBeGreaterThan(closed + 60))
    // The text sits inside the card, 20px in from its edge
    const inside = text.getBoundingClientRect().left - card.getBoundingClientRect().left
    expect(inside).toBeCloseTo(22, 0)
    await userEvent.keyboard("{Enter}")
    await waitFor(() => expect(card.getBoundingClientRect().height).toBeCloseTo(closed, 0))
  },
}

export const TestCardInDarkTheme: Story = {
  name: "Test: Card in dark theme",
  globals: { theme: "dark" },
  args: { variant: "card", defaultOpen: true },
}

export const TestCardWithMoreContrast: Story = {
  name: "Test: Card with more contrast",
  globals: { contrast: "more" },
  args: { variant: "card", defaultOpen: true },
}

/** Reads a value on every frame for `ms` milliseconds */
async function sample<T>(read: () => T, ms: number): Promise<T[]> {
  const values: T[] = []
  const end = performance.now() + ms
  while (performance.now() < end) {
    await new Promise(requestAnimationFrame)
    values.push(read())
  }
  return values
}

/** The transitions running on an element's focus ring, which appears at once */
function ringTransitions(element: Element): Animation[] {
  return element
    .getAnimations()
    .filter((animation) => (animation as CSSTransition).transitionProperty === "outline-color")
}

import { For } from "solid-js"
import { expect, fn, userEvent, waitFor, within } from "storybook/test"
import type { Meta, StoryObj } from "storybook-solidjs-vite"
import { Button } from "../button/index.js"
import { Checkbox } from "../checkbox/index.js"
import { settled } from "../foundations/settled.js"
import { frame, swipe } from "../foundations/swipe.js"
import { Drawer } from "./index.js"

const cultures = ["Blé tendre", "Orge d'hiver", "Colza", "Maïs grain"]

function Filters(props: Drawer.RootProps) {
  return (
    <Drawer.Root {...props}>
      <Drawer.Trigger as={Button} variant="outline">
        Filtrer
      </Drawer.Trigger>
      <Drawer.Backdrop />
      <Drawer.Positioner>
        <Drawer.Content>
          <Drawer.Grabber>
            <Drawer.Grabber.Indicator />
          </Drawer.Grabber>
          <Drawer.Title>Filtrer les parcelles</Drawer.Title>
          <Drawer.Description>Ne montrer que les parcelles de ces cultures.</Drawer.Description>
          <div role="group" aria-label="Cultures">
            <For each={cultures}>{(culture) => <Checkbox>{culture}</Checkbox>}</For>
          </div>
          <Drawer.Trigger.Close as={Button} tone="neutral" variant="outline" block>
            Fermer
          </Drawer.Trigger.Close>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  )
}

const meta = {
  title: "Components/Drawer",
  component: Filters,
  tags: ["autodocs"],
  args: { onOpenChange: fn() },
} satisfies Meta<typeof Filters>

export default meta
type Story = StoryObj<typeof meta>

const content = () => document.querySelector<HTMLElement>('[data-scope="drawer"][data-part="content"]')!
const grabber = () => document.querySelector<HTMLElement>('[data-scope="drawer"][data-part="grabber"]')!

/**
 * A panel that rises from the bottom, named by its title and described by the sentence under it. Its props are in the
 * Controls panel.
 */
export const Playground: Story = {
  args: {
    role: "dialog",
    modal: true,
    closeOnInteractOutside: true,
    closeOnEscape: true,
    restoreFocus: true,
    swipeDirection: "down",
  },
  argTypes: {
    role: { control: "inline-radio", options: ["dialog", "alertdialog"] },
    modal: { control: "boolean" },
    closeOnInteractOutside: { control: "boolean" },
    closeOnEscape: { control: "boolean" },
    restoreFocus: { control: "boolean" },
    swipeDirection: { control: "inline-radio", options: ["down", "up", "start", "end"] },
  },
}

export const Open: Story = {
  args: { defaultOpen: true },
  play: settled,
}

/**
 * It rises from the bottom, named by its title and described by the sentence under it. Focus moves into it, Escape
 * closes it and focus comes back to the trigger. Its close button, named by its own words, closes it too.
 */
export const TestOpeningAndClosing: Story = {
  name: "Test: Opening and closing",
  play: async ({ args }) => {
    const page = within(document.body)
    const trigger = page.getByRole("button", { name: "Filtrer" })
    await userEvent.click(trigger)
    const drawer = await page.findByRole("dialog", { name: "Filtrer les parcelles" })
    expect(drawer).toHaveAccessibleDescription("Ne montrer que les parcelles de ces cultures.")
    await waitFor(() => expect(drawer.contains(document.activeElement)).toBe(true))
    await settled()
    expect(drawer.getBoundingClientRect().bottom).toBeCloseTo(innerHeight, 0)

    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(page.queryByRole("dialog")).toBeNull())
    await waitFor(() => expect(trigger).toHaveFocus())
    expect(args.onOpenChange).toHaveBeenLastCalledWith({ open: false })

    await userEvent.click(trigger)
    await userEvent.click(await page.findByRole("button", { name: "Fermer" }))
    await waitFor(() => expect(page.queryByRole("dialog")).toBeNull())
  },
}

/**
 * Swiped down a little it settles back in place, and the dim with it. Swiped far enough it goes on down from where the
 * thumb left it, without coming back up first, and the dim clears.
 */
export const TestSwipedAway: Story = {
  name: "Test: Swiped away",
  args: { defaultOpen: true },
  play: async ({ args }) => {
    const page = within(document.body)
    const drawer = await page.findByRole("dialog")
    const backdrop = document.querySelector<HTMLElement>('[data-scope="drawer"][data-part="backdrop"]')!
    await settled()
    const top = drawer.getBoundingClientRect().top

    await swipe(content(), 30)
    await settled()
    expect(drawer).toBeVisible()
    expect(drawer.getBoundingClientRect().top).toBeCloseTo(top, 0)
    // However the dim is drawn, all of it is back
    const layers = [backdrop, ...backdrop.querySelectorAll("*")]
    expect(layers.map((layer) => getComputedStyle(layer).opacity)).toEqual(layers.map(() => "1"))

    await swipe(content(), 400)
    const tops = await topsUntilGone(drawer)
    expect(tops[0]).toBeGreaterThan(top + 300)
    expect(tops).toEqual([...tops].sort((a, b) => a - b))
    await waitFor(() => expect(page.queryByRole("dialog")).toBeNull())
    expect(args.onOpenChange).toHaveBeenLastCalledWith({ open: false })
  },
}

/** The top of `element` on every frame until it leaves the page, rounded to the pixel */
async function topsUntilGone(element: HTMLElement) {
  const tops = [Math.round(element.getBoundingClientRect().top)]
  for (let count = 0; count < 120; count++) {
    await frame()
    if (!element.isConnected) break
    tops.push(Math.round(element.getBoundingClientRect().top))
  }
  return tops
}

/**
 * Closed half way up, it turns round from where it is: it goes back down from there, where a keyframe exit would start
 * from the open look and jump up first. The opening is slowed down so the few milliseconds the test takes to press
 * Escape barely move it.
 */
export const TestClosedWhileOpening: Story = {
  name: "Test: Closed while opening",
  play: async () => {
    const root = document.documentElement
    root.style.setProperty("--duration-sheet", "10s")
    try {
      const page = within(document.body)
      await userEvent.click(page.getByRole("button", { name: "Filtrer" }))
      const drawer = await page.findByRole("dialog")
      await waitFor(() => expect(drawer.getBoundingClientRect().top).toBeLessThan(innerHeight - 40), { timeout: 3000 })
      const before = drawer.getBoundingClientRect().top

      await userEvent.keyboard("{Escape}")
      const tops = await topsUntilGone(drawer)
      expect(tops[0]).toBeGreaterThan(before - 10)
      expect(tops).toEqual([...tops].sort((a, b) => a - b))
      expect(tops.at(-1)).toBeGreaterThan(innerHeight - 10)
    } finally {
      root.style.removeProperty("--duration-sheet")
    }
  },
}

/**
 * Swiped away and opened again before it has left, it turns round from where it is. Zag keeps its swipe state a frame
 * into the reopening, which once made the drawer jump back up by all it had slid out. The exit is slowed down, so the
 * drawer is well on its way out when the trigger is pressed.
 */
export const TestOpenedAgainWhileSwipedAway: Story = {
  name: "Test: Opened again while swiped away",
  args: { defaultOpen: true },
  play: async () => {
    const root = document.documentElement
    const page = within(document.body)
    const drawer = await page.findByRole("dialog")
    await settled()
    root.style.setProperty("--duration-exit", "3s")
    try {
      await swipe(content(), 300)
      const letGo = drawer.getBoundingClientRect().top
      await waitFor(() => expect(drawer.getBoundingClientRect().top).toBeGreaterThan(letGo + 60))
      const before = drawer.getBoundingClientRect().top

      await userEvent.click(page.getByRole("button", { name: "Filtrer" }))
      expect(Math.abs(drawer.getBoundingClientRect().top - before)).toBeLessThan(20)
      await settled()
      expect(drawer.getBoundingClientRect().bottom).toBeCloseTo(innerHeight, 0)
    } finally {
      root.style.removeProperty("--duration-exit")
    }
  },
}

/** On a phone it spans the screen and sits on its bottom edge */
export const TestOnAPhone: Story = {
  name: "Test: On a phone",
  args: { defaultOpen: true },
  globals: { viewport: { value: "mobile2", isRotated: false } },
  play: async () => {
    const drawer = await within(document.body).findByRole("dialog")
    await settled()
    const sheet = drawer.getBoundingClientRect()
    expect(sheet.bottom).toBeCloseTo(innerHeight, 0)
    expect(sheet.width).toBeCloseTo(innerWidth, 0)
  },
}

/** With reduced motion it does not slide: it is in place from the first frame, and only fades in */
export const TestWithReducedMotion: Story = {
  name: "Test: With reduced motion",
  globals: { motion: "reduced" },
  play: async () => {
    const page = within(document.body)
    await userEvent.click(page.getByRole("button", { name: "Filtrer" }))
    const drawer = await page.findByRole("dialog")
    const tops: number[] = []
    for (let frame = 0; frame < 6; frame++) {
      await new Promise(requestAnimationFrame)
      tops.push(Math.round(drawer.getBoundingClientRect().top))
    }
    await settled()
    const settledTop = Math.round(drawer.getBoundingClientRect().top)
    expect(tops).toEqual(tops.map(() => settledTop))
  },
}

/** On the end edge, the right in French, for a panel of details next to a list on a wide screen */
export const TestOnTheRight: Story = {
  name: "Test: On the right",
  args: { defaultOpen: true, swipeDirection: "end" },
  play: async () => {
    const drawer = await within(document.body).findByRole("dialog")
    await settled()
    const panel = drawer.getBoundingClientRect()
    expect(panel.right).toBeCloseTo(innerWidth, 0)
    expect(panel.height).toBeCloseTo(innerHeight, 0)
  },
}

const allCultures = [
  "Blé tendre",
  "Blé dur",
  "Orge d'hiver",
  "Orge de printemps",
  "Avoine",
  "Seigle",
  "Triticale",
  "Colza",
  "Tournesol",
  "Maïs grain",
  "Maïs ensilage",
  "Sorgho",
  "Pois protéagineux",
  "Féverole",
  "Soja",
  "Lin",
  "Chanvre",
  "Betterave sucrière",
  "Pomme de terre",
  "Prairie temporaire",
]

// The same drawer with a list long enough to scroll once it is all the way open
function AllCultures(props: Drawer.RootProps) {
  return (
    <Drawer.Root {...props}>
      <Drawer.Trigger as={Button} variant="outline">
        Filtrer
      </Drawer.Trigger>
      <Drawer.Backdrop />
      <Drawer.Positioner>
        <Drawer.Content>
          <Drawer.Grabber>
            <Drawer.Grabber.Indicator />
          </Drawer.Grabber>
          <Drawer.Title>Filtrer les parcelles</Drawer.Title>
          <Drawer.Description>Ne montrer que les parcelles de ces cultures.</Drawer.Description>
          <div role="group" aria-label="Cultures">
            <For each={allCultures}>{(culture) => <Checkbox>{culture}</Checkbox>}</For>
          </div>
          <Drawer.Trigger.Close as={Button} tone="neutral" variant="outline" block>
            Fermer
          </Drawer.Trigger.Close>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  )
}

/**
 * With `snapPoints` it rests half open on a phone, its list cut by the bottom edge. Swiped up by its grabber it opens
 * all the way, and the grabber stays at its top while the list scrolls under it, so it can still be pulled down.
 */
export const TestWithSnapPoints: Story = {
  name: "Test: With snap points",
  args: { defaultOpen: true },
  globals: { viewport: { value: "mobile2", isRotated: false } },
  render: (args) => <AllCultures {...args} snapPoints={[0.5, 1]} />,
  play: async () => {
    const drawer = await within(document.body).findByRole("dialog")
    await settled()
    const half = drawer.getBoundingClientRect()
    expect(innerHeight - half.top).toBeCloseTo(document.documentElement.clientHeight / 2, 0)

    await swipe(grabber(), -200)
    await settled()
    const open = drawer.getBoundingClientRect()
    expect(open.bottom).toBeCloseTo(innerHeight, 0)
    expect(open.top).toBeLessThan(half.top - 100)

    drawer.scrollTop = drawer.scrollHeight
    await frame()
    expect(drawer.scrollTop).toBeGreaterThan(0)
    expect(grabber().getBoundingClientRect().top - open.top).toBeLessThan(4)
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

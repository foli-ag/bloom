import { For } from "solid-js"
import { expect, fn, userEvent, waitFor, within } from "storybook/test"
import type { Meta, StoryObj } from "storybook-solidjs-vite"
import { Button } from "../button/index.js"
import { Checkbox } from "../checkbox/index.js"
import { settled } from "../foundations/settled.js"
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

/**
 * Drags `element` down by `dy` pixels with a touch pointer, the way a thumb does. Zag follows the pointer from its
 * first move, so the events are dispatched one by one.
 */
async function swipeDown(element: HTMLElement, dy: number) {
  const { left, top } = element.getBoundingClientRect()
  const init = { bubbles: true, pointerId: 1, pointerType: "touch", isPrimary: true, clientX: left + 20, button: 0 }
  element.dispatchEvent(new PointerEvent("pointerdown", { ...init, clientY: top + 20, buttons: 1 }))
  for (let step = 1; step <= 10; step++) {
    element.dispatchEvent(
      new PointerEvent("pointermove", { ...init, clientY: top + 20 + (dy * step) / 10, buttons: 1 }),
    )
    await new Promise(requestAnimationFrame)
  }
  element.dispatchEvent(new PointerEvent("pointerup", { ...init, clientY: top + 20 + dy }))
}

/**
 * It rises from the bottom, named by its title and described by the sentence under it. Focus moves into it, Escape
 * closes it and focus comes back to the trigger. Its close button, named by its own words, closes it too.
 */
export const Default: Story = {
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

/** Swiped down a little it settles back in place. Swiped far enough it goes and the dim clears. */
export const SwipedAway: Story = {
  args: { defaultOpen: true },
  play: async ({ args }) => {
    const page = within(document.body)
    const drawer = await page.findByRole("dialog")
    await settled()
    const top = drawer.getBoundingClientRect().top

    await swipeDown(content(), 30)
    await settled()
    expect(drawer).toBeVisible()
    expect(drawer.getBoundingClientRect().top).toBeCloseTo(top, 0)

    await swipeDown(content(), 400)
    await waitFor(() => expect(page.queryByRole("dialog")).toBeNull())
    expect(args.onOpenChange).toHaveBeenLastCalledWith({ open: false })
  },
}

/** On a phone it spans the screen and sits on its bottom edge */
export const OnAPhone: Story = {
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
export const WithReducedMotion: Story = {
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
export const OnTheRight: Story = {
  args: { defaultOpen: true, swipeDirection: "end" },
  play: async () => {
    const drawer = await within(document.body).findByRole("dialog")
    await settled()
    const panel = drawer.getBoundingClientRect()
    expect(panel.right).toBeCloseTo(innerWidth, 0)
    expect(panel.height).toBeCloseTo(innerHeight, 0)
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

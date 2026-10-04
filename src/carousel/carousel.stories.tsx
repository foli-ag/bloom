import { For } from "solid-js"
import { expect, fn, userEvent, waitFor, within } from "storybook/test"
import type { Meta, StoryObj } from "storybook-solidjs-vite"
import { Button } from "../button/index.js"
import { settled } from "../foundations/settled.js"
import { Carousel } from "./index.js"

const visits = [
  { parcel: "Les Grands Champs", note: "Blé tendre au stade épi 1 cm" },
  { parcel: "La Noue", note: "Colza en fleur, quelques méligèthes" },
  { parcel: "Le Pré Haut", note: "Orge d'hiver, rouille naine sur 5 % des feuilles" },
  { parcel: "Bois Joli", note: "Maïs semé le 12 avril, levée régulière" },
]

const translations: Carousel.Translations = {
  indicator: (index) => `Visite ${index + 1}`,
  item: (index, count) => `${index + 1} sur ${count}`,
  progressText: ({ page, totalPages }) => `${page} sur ${totalPages}`,
}

function Visits(props: Partial<Carousel.RootProps>) {
  return (
    <Carousel.Root slideCount={visits.length} translations={translations} class="max-w-sm" {...props}>
      <Carousel.Group>
        <For each={visits}>
          {(visit, index) => (
            <Carousel.Item index={index()}>
              <div class="grid h-40 content-end gap-1 bg-primary-soft p-4">
                <strong class="text-lg text-ink">{visit.parcel}</strong>
                <span class="text-ink">{visit.note}</span>
              </div>
            </Carousel.Item>
          )}
        </For>
      </Carousel.Group>
      <Carousel.Control>
        <Carousel.Trigger.Prev as={Button} tone="neutral" variant="outline">
          Précédente
        </Carousel.Trigger.Prev>
        <Carousel.ProgressText />
        <Carousel.Trigger.Next as={Button} tone="neutral" variant="outline">
          Suivante
        </Carousel.Trigger.Next>
      </Carousel.Control>
      <Carousel.IndicatorGroup>
        <For each={visits}>{(_, index) => <Carousel.Indicator index={index()} />}</For>
      </Carousel.IndicatorGroup>
    </Carousel.Root>
  )
}

const meta = {
  title: "Components/Carousel",
  component: Visits,
  tags: ["autodocs"],
  args: { onPageChange: fn() },
} satisfies Meta<typeof Visits>

export default meta
type Story = StoryObj<typeof meta>

/**
 * A row of visits seen one at a time, with triggers and dots to move between them. Its props are in the Controls panel.
 */
export const Playground: Story = {
  argTypes: {
    slidesPerPage: { control: "number" },
    loop: { control: "boolean" },
    allowMouseDrag: { control: "boolean" },
    autoplay: { control: "boolean" },
    autoSize: { control: "boolean" },
    snapType: { control: "inline-radio", options: ["mandatory", "proximity"] },
    spacing: { control: "text" },
    padding: { control: "text" },
    peek: { control: "boolean" },
  },
}

export const OnAPhone: Story = {
  globals: { viewport: { value: "mobile2", isRotated: false } },
}

/**
 * The triggers step one visit at a time and are named by their own words, not zag's English ones. The slide in view
 * and the progress follow, and a dot jumps straight to its visit.
 */
export const TestSteppingThroughTheVisits: Story = {
  name: "Test: Stepping through the visits",
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const previous = canvas.getByRole("button", { name: "Précédente" })
    expect(previous).toBeDisabled()
    expect(await canvas.findByRole("group", { name: "1 sur 4" })).toHaveTextContent("Les Grands Champs")
    expect(canvas.getByText("1 sur 4")).toBeVisible()
    expect(canvas.getByRole("button", { name: "Visite 1" })).toHaveAttribute("aria-current", "true")

    await userEvent.click(canvas.getByRole("button", { name: "Suivante" }))
    await waitFor(() => expect(canvas.getByRole("group", { name: "2 sur 4" })).toHaveTextContent("La Noue"))
    expect(args.onPageChange).toHaveBeenLastCalledWith(expect.objectContaining({ page: 1 }))
    expect(canvas.getByText("2 sur 4")).toBeVisible()

    await userEvent.click(canvas.getByRole("button", { name: "Visite 4" }))
    await waitFor(() => expect(canvas.getByRole("group", { name: "4 sur 4" })).toHaveTextContent("Bois Joli"))
    expect(canvas.getByRole("button", { name: "Visite 4" })).toHaveAttribute("aria-current", "true")
    await waitFor(() => expect(canvas.getByRole("button", { name: "Suivante" })).toBeDisabled())

    await userEvent.click(previous)
    await waitFor(() => expect(canvas.getByRole("group", { name: "3 sur 4" })).toHaveTextContent("Le Pré Haut"))
    await settled()
  },
}

/** Each dot is a finger-wide target, though it shows as a small circle */
export const TestDotsAreFingerWide: Story = {
  name: "Test: Dots are finger-wide",
  play: async ({ canvasElement }) => {
    for (const dot of within(canvasElement).getAllByRole("button", { name: /^Visite/ })) {
      const { width, height } = dot.getBoundingClientRect()
      expect(width).toBeGreaterThanOrEqual(48)
      expect(height).toBeGreaterThanOrEqual(48)
    }
    const current = within(canvasElement).getByRole("button", { name: "Visite 1" })
    await settled()
    expect(getComputedStyle(current, "::before").scale).toBe("1.25")
    expect(getComputedStyle(current, "::before").width).toBe("14px")
  },
}

/** With reduced motion, the next visit is in place at once instead of gliding across the screen */
export const TestWithReducedMotion: Story = {
  name: "Test: With reduced motion",
  globals: { motion: "reduced" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const group = canvasElement.querySelector<HTMLElement>("[data-scope=carousel][data-part=item-group]")!
    // Out of view, it is hidden from a screen reader
    const second = canvasElement.querySelectorAll<HTMLElement>("[data-scope=carousel][data-part=item]")[1]!
    await canvas.findByRole("group", { name: "1 sur 4" })
    await userEvent.click(canvas.getByRole("button", { name: "Suivante" }))
    // A glide takes about 300ms; two frames later it would have barely started
    await new Promise(requestAnimationFrame)
    await new Promise(requestAnimationFrame)
    expect(second.getBoundingClientRect().left).toBeCloseTo(group.getBoundingClientRect().left, 0)
  },
}

export const TestInDarkTheme: Story = {
  name: "Test: In dark theme",
  args: { defaultPage: 1 },
  globals: { theme: "dark" },
  play: settled,
}

export const TestWithMoreContrast: Story = {
  name: "Test: With more contrast",
  args: { defaultPage: 1 },
  globals: { contrast: "more" },
  play: settled,
}

/** The next visit shows at the edge of the row, so it is plain the row can be swiped */
export const Peek: Story = {
  args: { peek: true },
}

/** On a phone, where swiping is how a farmer moves through the visits */
export const PeekOnAPhone: Story = {
  args: { peek: true },
  globals: { viewport: { value: "mobile2", isRotated: false } },
}

function slides(canvasElement: HTMLElement) {
  const group = canvasElement.querySelector<HTMLElement>("[data-scope=carousel][data-part=item-group]")!
  const items = [...canvasElement.querySelectorAll<HTMLElement>("[data-scope=carousel][data-part=item]")]
  const row = group.getBoundingClientRect()
  /** How much of a slide shows inside the row */
  const showing = (index: number) => {
    const slide = items[index]!.getBoundingClientRect()
    return Math.max(0, Math.min(slide.right, row.right) - Math.max(slide.left, row.left))
  }
  return { group, items, row, showing }
}

/**
 * The first visit starts at the row's start and the next one shows at its end. Once moved on, the visit before shows at
 * the start too. The dots, the counter and the slide a screen reader is given still follow the page.
 */
export const TestPeek: Story = {
  name: "Test: Peek",
  args: { peek: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await canvas.findByRole("group", { name: "1 sur 4" })
    await settled()
    let { row, items, showing } = slides(canvasElement)
    expect(items[0]!.getBoundingClientRect().left).toBeCloseTo(row.left, 0)
    expect(showing(1)).toBeGreaterThan(24)
    expect(items[1]).toHaveAttribute("aria-hidden", "true")

    await userEvent.click(canvas.getByRole("button", { name: "Suivante" }))
    await waitFor(() => expect(canvas.getByText("2 sur 4")).toBeVisible())
    await settled()
    ;({ row, items, showing } = slides(canvasElement))
    expect(showing(0)).toBeGreaterThan(8)
    expect(showing(2)).toBeGreaterThan(8)
    expect(showing(1)).toBeCloseTo(items[1]!.getBoundingClientRect().width, 0)
    expect(canvas.getByRole("button", { name: "Visite 2" })).toHaveAttribute("aria-current", "true")

    await userEvent.click(canvas.getByRole("button", { name: "Visite 4" }))
    await waitFor(() => expect(canvas.getByText("4 sur 4")).toBeVisible())
    await settled()
    ;({ row, items } = slides(canvasElement))
    expect(items[3]!.getBoundingClientRect().right).toBeCloseTo(row.right, 0)
  },
}

/**
 * A swipe that stops between two visits snaps to the nearer one, and the dots and the counter follow it. The browser's
 * snap and zag's count of the pages agree, the last page included.
 */
export const TestPeekSnapsAfterASwipe: Story = {
  name: "Test: Peek snaps after a swipe",
  args: { peek: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await canvas.findByRole("group", { name: "1 sur 4" })
    await settled()
    const { group, items } = slides(canvasElement)
    const step = items[1]!.offsetLeft - items[0]!.offsetLeft
    group.dispatchEvent(new TouchEvent("touchstart", { bubbles: true }))
    await new Promise(requestAnimationFrame)
    group.scrollTo({ left: step * 2.3, behavior: "instant" })
    await waitFor(() => expect(canvas.getByText("3 sur 4")).toBeVisible())
    expect(canvas.getByRole("button", { name: "Visite 3" })).toHaveAttribute("aria-current", "true")
    group.dispatchEvent(new TouchEvent("touchstart", { bubbles: true }))
    await new Promise(requestAnimationFrame)
    group.scrollTo({ left: group.scrollWidth, behavior: "instant" })
    await waitFor(() => expect(canvas.getByText("4 sur 4")).toBeVisible())
    await waitFor(() => expect(canvas.getByRole("button", { name: "Suivante" })).toBeDisabled())
  },
}

/** With reduced motion a peeking row still changes page at once */
export const TestPeekWithReducedMotion: Story = {
  name: "Test: Peek with reduced motion",
  args: { peek: true },
  globals: { motion: "reduced" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await canvas.findByRole("group", { name: "1 sur 4" })
    await settled()
    const { group, items } = slides(canvasElement)
    const stop = items[1]!.offsetLeft - Number.parseFloat(getComputedStyle(group).scrollPaddingLeft)
    await userEvent.click(canvas.getByRole("button", { name: "Suivante" }))
    await new Promise(requestAnimationFrame)
    await new Promise(requestAnimationFrame)
    expect(group.scrollLeft).toBeCloseTo(stop, 0)
  },
}

export const TestPeekInDarkTheme: Story = {
  name: "Test: Peek in dark theme",
  args: { peek: true, defaultPage: 1 },
  globals: { theme: "dark" },
  play: settled,
}

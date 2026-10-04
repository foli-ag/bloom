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

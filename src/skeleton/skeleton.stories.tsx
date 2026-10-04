import { createSignal, Show } from "solid-js"
import { expect, waitFor, within } from "storybook/test"
import type { Meta, StoryObj } from "storybook-solidjs-vite"
import { Card } from "../card/index.js"
import { Skeleton } from "./index.js"

const meta = {
  title: "Components/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  args: { shape: "text", lines: 3 },
  decorators: [(Story) => <div class="w-80">{Story()}</div>],
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

/** Lines of text loading, the last one shorter. Its props are in the Controls panel. */
export const Playground: Story = {
  argTypes: {
    shape: { control: "inline-radio", options: ["text", "circle", "rect"] },
    lines: { control: { type: "number", min: 1, max: 8 } },
  },
}

/** The three shapes: a line as tall as its text, a circle for an avatar, a rectangle for a photo */
export const Shapes: Story = {
  render: () => (
    <div class="grid gap-4">
      <div class="flex items-center gap-3">
        <Skeleton shape="circle" />
        <Skeleton class="w-1/2 text-lg" />
      </div>
      <Skeleton shape="rect" class="aspect-[2/1] h-auto" />
      <Skeleton lines={3} />
    </div>
  ),
}

/**
 * A card while it loads: the same parts with skeletons in place of words, so nothing moves when they arrive. The card
 * says it is busy, and a status says so in words.
 */
export const ACardLoading: Story = {
  render: () => <FieldCard loading />,
}

function FieldCard(props: { loading: boolean }) {
  return (
    <Card.Root aria-busy={props.loading ? "true" : undefined}>
      <span role="status" class="sr-only">
        {props.loading ? "Chargement de la parcelle…" : ""}
      </span>
      <Show
        when={!props.loading}
        fallback={
          <>
            <Card.Header>
              <Skeleton class="w-3/5 text-lg" />
              <Skeleton class="w-2/5" />
            </Card.Header>
            <Skeleton lines={2} />
          </>
        }
      >
        <Card.Header>
          <Card.Title>Les Grands Champs</Card.Title>
          <Card.Description>Blé tendre, 12,4 ha</Card.Description>
        </Card.Header>
        <Card.Body>Semé le 12 octobre, levée régulière sur toute la parcelle.</Card.Body>
      </Show>
    </Card.Root>
  )
}

/** The words take the skeleton's place without the card changing height: each line is as tall as the text it stands for */
export const TestNothingMovesWhenTheWordsArrive: Story = {
  name: "Test: Nothing moves when the words arrive",
  render: () => {
    const [loading, setLoading] = createSignal(true)
    return (
      <div class="grid gap-3">
        <FieldCard loading={loading()} />
        <button type="button" onClick={() => setLoading(false)}>
          Charger
        </button>
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const card = canvasElement.querySelector<HTMLElement>("[data-scope=card]")!
    expect(card).toHaveAttribute("aria-busy", "true")
    expect(canvas.getByRole("status")).toHaveTextContent("Chargement de la parcelle…")
    for (const skeleton of canvasElement.querySelectorAll("[data-scope=skeleton]"))
      expect(skeleton).toHaveAttribute("aria-hidden", "true")
    const before = card.getBoundingClientRect().height
    canvas.getByRole("button", { name: "Charger" }).click()
    await waitFor(() => expect(card).not.toHaveAttribute("aria-busy"))
    expect(card.getBoundingClientRect().height).toBeCloseTo(before, 0)
  },
}

/** The sheen moves by `translate`, which the compositor runs, and never by `background-position` */
export const TestTheSheenRunsOnTheCompositor: Story = {
  ...Shapes,
  name: "Test: The sheen runs on the compositor",
  play: ({ canvasElement }) => {
    const animations = canvasElement.ownerDocument
      .getAnimations()
      .filter((animation) => (animation as CSSAnimation).animationName === "bloom-skeleton-sheen")
    expect(animations.length).toBeGreaterThan(0)
    for (const animation of animations) {
      const properties = (animation.effect as KeyframeEffect).getKeyframes().flatMap((frame) => Object.keys(frame))
      expect(properties).toContain("translate")
      expect(properties).not.toContain("backgroundPosition")
    }
  },
}

/** With reduced motion the sheen stops, and the placeholder stays still */
export const TestStillWithReducedMotion: Story = {
  ...Shapes,
  name: "Test: Still with reduced motion",
  globals: { motion: "reduced" },
  play: () => {
    const sheens = document
      .getAnimations()
      .filter((animation) => (animation as CSSAnimation).animationName === "bloom-skeleton-sheen")
    expect(sheens).toEqual([])
  },
}

export const TestACardLoadingInDarkTheme: Story = {
  ...ACardLoading,
  name: "Test: A card loading in dark theme",
  globals: { theme: "dark" },
}

export const TestACardLoadingWithMoreContrast: Story = {
  ...ACardLoading,
  name: "Test: A card loading with more contrast",
  globals: { contrast: "more" },
}

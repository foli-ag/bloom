import { expect, within } from "storybook/test"
import type { Meta, StoryObj } from "storybook-solidjs-vite"
import { Card } from "../card/index.js"
import { Skeleton } from "./index.js"

const meta = {
  title: "Components/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  args: { class: "h-4 w-48" },
  decorators: [(Story) => <div class="w-80">{Story()}</div>],
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

/** One bar, sized by its classes. Its props are in the Controls panel. */
export const Playground: Story = {}

/** Shapes are classes: a circle for an avatar, a rectangle for a photo, one bar per line of text, the last one shorter */
export const Shapes: Story = {
  render: () => (
    <div class="grid gap-4">
      <div class="flex items-center gap-3">
        <Skeleton class="size-12 rounded-full" />
        <Skeleton class="h-5 w-1/2" />
      </div>
      <Skeleton class="aspect-[2/1] w-full" />
      <div class="grid gap-2">
        <Skeleton class="h-4 w-full" />
        <Skeleton class="h-4 w-full" />
        <Skeleton class="h-4 w-3/5" />
      </div>
    </div>
  ),
}

/** A card while it loads: the same parts with skeletons in place of words. The card says it is busy, and a status says so in words. */
export const ACardLoading: Story = {
  render: () => (
    <Card.Root aria-busy="true">
      <span role="status" class="sr-only">
        Chargement de la parcelle…
      </span>
      <Card.Header>
        <Skeleton class="h-6 w-3/5" />
        <Skeleton class="h-4 w-2/5" />
      </Card.Header>
      <div class="grid gap-2">
        <Skeleton class="h-4 w-full" />
        <Skeleton class="h-4 w-3/5" />
      </div>
    </Card.Root>
  ),
}

/** Screen readers skip the skeletons and hear the status instead */
export const TestHiddenFromAssistiveTechnology: Story = {
  ...ACardLoading,
  name: "Test: Hidden from assistive technology",
  play: ({ canvasElement }) => {
    expect(within(canvasElement).getByRole("status")).toHaveTextContent("Chargement de la parcelle…")
    const skeletons = canvasElement.querySelectorAll("[data-scope=skeleton]")
    expect(skeletons.length).toBeGreaterThan(0)
    for (const skeleton of skeletons) expect(skeleton).toHaveAttribute("aria-hidden", "true")
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

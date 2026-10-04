import { Tabs as Seed } from "@foliag/seeds/tabs"
import type { JSX } from "@solidjs/web"
import { omit, Show, type Element } from "solid-js"
import { tv } from "../internal/variants.js"
import { segment, segmentWords } from "../internal/choice.js"
import { useTabsVariant } from "./tabs-variant.js"

export type TabsTriggerProps = Omit<Seed.TriggerProps, "class" | "children"> & {
  /** The page's name. It is the tab's name and its page's, so it is required. */
  children: JSX.Element
  class?: string | undefined
}

/**
 * A tab, 48px tall. The chosen one turns to full ink and the `Indicator` slides under it, or behind it as a pill in a
 * `segmented` row, so the choice is not shown by a color alone.
 */
export function TabsTrigger(props: TabsTriggerProps): Element {
  const variant = useTabsVariant()
  return (
    <Show
      when={variant() === "segmented"}
      fallback={<Seed.Trigger {...omit(props, "class")} class={trigger({ class: props.class })} />}
    >
      <Seed.Trigger {...omit(props, "class", "children")} class={segmentTrigger({ class: props.class })}>
        <span class={segmentWords()}>{props.children}</span>
      </Seed.Trigger>
    </Show>
  )
}

// The ring is drawn inside, as the row scrolls and would clip one drawn outside, and shows at once: the transition
// names its colors, as `transition-colors` would ease the ring's color in too. A finger going down on a tab tints it at
// once, before the page changes as it lifts; the tint eases away on the smooth spring.
const trigger = tv({
  base: [
    "inline-flex min-h-12 shrink-0 pressable items-center justify-center gap-2 rounded-control px-4 py-2",
    "text-base font-semibold whitespace-nowrap tracking-body text-muted",
    "transition-[color,background-color] duration-(--duration-smooth) ease-smooth hover:text-ink aria-selected:text-ink",
    "pressing:bg-neutral-soft pressing:duration-(--duration-press) pressing:ease-press",
    // `outline-none` sets the style Tailwind's width reads back, so the ring names its own
    "focus-ring",
    "data-[orientation=vertical]:justify-start",
    "data-disabled:cursor-not-allowed data-disabled:text-disabled-ink",
  ],
})

// In a track the tab is a segment: a tint in the pill's shape under the finger, its words going down a little, and its
// ring where the pill's edge is. The chosen tab's words turn to full ink, 7:1 on the pill and on the track alike, so
// they read at every moment of the slide.
const segmentTrigger = tv({
  base: [segment(), "shrink-0 px-4 whitespace-nowrap text-muted hover:text-ink aria-selected:text-ink"],
})

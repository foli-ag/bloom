import { Tabs as Seed } from "@foliag/seeds/tabs"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"
import { pill, pillMiddle } from "../internal/choice.js"
import { useTabsVariant } from "./tabs-variant.js"

export type TabsIndicatorProps = Omit<Seed.IndicatorProps, "class" | "children"> & {
  class?: string | undefined
}

/**
 * A bar under the chosen tab, or beside it down the side, that slides and stretches to the next one on the smooth
 * spring. In a `segmented` row it is a pill behind the chosen tab instead, which slides and stretches the same way.
 * Place it in the `List`, after the tabs.
 */
export function TabsIndicator(props: TabsIndicatorProps): Element {
  const variant = useTabsVariant()
  return (
    <Seed.Indicator
      {...omit(props, "class")}
      class={variant() === "segmented" ? segmentedPill({ class: props.class }) : indicator({ class: props.class })}
    >
      <span class={variant() === "segmented" ? pillMiddle() : middle()} />
    </Seed.Indicator>
  )
}

// Under the tabs, in the track's own stacking context, so it shows behind their words and over the track
const segmentedPill = tv({ base: [pill(), "group/pill -z-10"] })

// Zag places the bar with `left` or `top` and sizes it with `width` or `height`, which the browser lays out again on
// every frame, and only while the page is idle: a new page that takes a moment to show would leave the bar sliding at
// its old length, then snapping. Here the bar is pinned at the start and slides by `translate`, and takes its new size
// at once without showing it. What shows is drawn inside it: a round cap at each end, `::before` and `::after`, and the
// straight part between them, which stretches by `scale` from its own length to the tab's. `tan(atan2())` turns the
// ratio of two lengths into the plain number `scale` takes. The caps keep their size, so the ends stay round as it
// stretches, and the three move on the indicator's own transition, which zag turns on only when the chosen tab changes.
// Under reduced motion it is under the new tab at once (`--duration-travel`), as a switch's knob is. The green
// of an edge reaches 3:1.
const indicator = tv({
  base: [
    "group/indicator pointer-events-none",
    "![--transition-property:translate,scale] [--transition-duration:var(--duration-travel)]",
    "[--transition-timing-function:var(--ease-smooth)]",
    "before:absolute before:top-0 before:left-0 before:size-1 before:rounded-full before:bg-primary-edge",
    "after:absolute after:top-0 after:left-0 after:size-1 after:rounded-full after:bg-primary-edge",
    "before:content-[''] after:content-[''] before:[transition:inherit] after:[transition:inherit]",
    "data-[orientation=horizontal]:bottom-0 data-[orientation=horizontal]:!left-0 data-[orientation=horizontal]:h-1",
    "data-[orientation=horizontal]:w-(--width) data-[orientation=horizontal]:translate-x-(--left)",
    "data-[orientation=horizontal]:after:translate-x-[calc(var(--width)-0.25rem)]",
    "data-[orientation=vertical]:end-0 data-[orientation=vertical]:!top-0 data-[orientation=vertical]:w-1",
    "data-[orientation=vertical]:h-(--height) data-[orientation=vertical]:translate-y-(--top)",
    "data-[orientation=vertical]:after:translate-y-[calc(var(--height)-0.25rem)]",
  ],
})

// From the middle of one cap to the middle of the other, 6rem long before it stretches
const middle = tv({
  base: [
    "absolute bg-primary-edge [transition:inherit]",
    "group-data-[orientation=horizontal]/indicator:top-0 group-data-[orientation=horizontal]/indicator:left-0.5",
    "group-data-[orientation=horizontal]/indicator:h-1 group-data-[orientation=horizontal]/indicator:w-24",
    "group-data-[orientation=horizontal]/indicator:origin-left",
    "group-data-[orientation=horizontal]/indicator:scale-x-[tan(atan2(calc(var(--width)-0.25rem),6rem))]",
    "group-data-[orientation=vertical]/indicator:top-0.5 group-data-[orientation=vertical]/indicator:left-0",
    "group-data-[orientation=vertical]/indicator:h-24 group-data-[orientation=vertical]/indicator:w-1",
    "group-data-[orientation=vertical]/indicator:origin-top",
    "group-data-[orientation=vertical]/indicator:scale-y-[tan(atan2(calc(var(--height)-0.25rem),6rem))]",
  ],
})

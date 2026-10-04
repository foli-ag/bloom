import { Tabs as Seed } from "@foliag/seeds/tabs"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"

export type TabsIndicatorProps = Omit<Seed.IndicatorProps, "class" | "children"> & {
  class?: string | undefined
}

/**
 * A bar under the chosen tab, or beside it down the side, that slides to the next one on the smooth spring. Place it
 * in the `List`, after the tabs.
 */
export function TabsIndicator(props: TabsIndicatorProps): Element {
  return <Seed.Indicator {...omit(props, "class")} class={indicator({ class: props.class })} />
}

// Zag places it with `left` or `top`. It is pinned at the start and moved by `translate` instead, so the slide does
// not lay out the row again; the transition list is overridden to match. The green of an edge reaches 3:1.
const indicator = tv({
  base: [
    "pointer-events-none rounded-full bg-primary-edge",
    "![--transition-property:translate,width,height] [--transition-duration:var(--duration-smooth)]",
    "[--transition-timing-function:var(--ease-smooth)]",
    "data-[orientation=horizontal]:bottom-0 data-[orientation=horizontal]:!left-0 data-[orientation=horizontal]:h-1",
    "data-[orientation=horizontal]:w-(--width) data-[orientation=horizontal]:translate-x-(--left)",
    "data-[orientation=vertical]:end-0 data-[orientation=vertical]:!top-0 data-[orientation=vertical]:w-1",
    "data-[orientation=vertical]:h-(--height) data-[orientation=vertical]:translate-y-(--top)",
  ],
})

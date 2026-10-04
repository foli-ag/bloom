import { Splitter as Seed } from "@foliag/seeds/splitter"
import { omit, type Element } from "solid-js"
import { tv } from "../internal/variants.js"

export type SplitterResizeTriggerIndicatorProps = Omit<Seed.ResizeTriggerIndicatorProps, "class" | "children"> & {
  class?: string | undefined
}

/** The grip on the bar, a pill with the edge color that reaches 3:1, turning green while dragged */
export function SplitterResizeTriggerIndicator(props: SplitterResizeTriggerIndicatorProps): Element {
  return <Seed.ResizeTrigger.Indicator {...omit(props, "class")} class={indicator({ class: props.class })} />
}

const indicator = tv({
  base: [
    "pointer-events-none rounded-full bg-strong transition-[background-color] duration-(--duration-smooth) ease-smooth",
    "data-[orientation=horizontal]:h-12 data-[orientation=horizontal]:w-1.5",
    "data-[orientation=vertical]:h-1.5 data-[orientation=vertical]:w-12",
    "group-hover/trigger:bg-ink data-dragging:bg-primary-edge data-disabled:bg-disabled-ink",
  ],
})

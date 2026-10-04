import { Splitter as Seed } from "@foliag/seeds/splitter"
import { omit, type Element } from "solid-js"
import { tv } from "../internal/variants.js"

export type SplitterPanelProps = Omit<Seed.PanelProps, "class"> & {
  class?: string | undefined
}

/**
 * One panel. What does not fit scrolls inside it, so a panel made narrow never pushes its neighbor. Its padding goes on
 * an element inside it: the panels share out the room left after their own padding, so padding on a panel would make
 * the bar move less than the pointer that drags it.
 *
 * Moved by the keyboard, or collapsed and expanded, the panels glide to their new sizes on the smooth spring, both on
 * one clock so the bar between them stays on their edge. Dragged, they follow the pointer exactly.
 */
export function SplitterPanel(props: SplitterPanelProps): Element {
  return <Seed.Panel {...omit(props, "class")} class={panel({ class: props.class })} />
}

// The one transition here that lays the page out again on every frame, as a split cannot change size any other way. It
// is short, and only for a key or a collapse, where the farmer has to see where the bar went.
const panel = tv({
  base: [
    "min-h-0 min-w-0 overflow-auto",
    "transition-[flex-grow] duration-(--duration-travel) ease-smooth data-dragging:transition-none",
  ],
})

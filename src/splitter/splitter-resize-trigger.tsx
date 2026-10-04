import { Splitter as Seed } from "@foliag/seeds/splitter"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"

export type SplitterResizeTriggerProps = Omit<Seed.ResizeTriggerProps, "class" | "aria-label"> & {
  /**
   * What the split sets, such as "Largeur de la carte". A separator takes no name from what it holds, so it is
   * required.
   */
  "aria-label": string
  class?: string | undefined
}

/**
 * The bar between two panels, 12px wide in the layout. Its target reaches 48px across, over the edges of both panels,
 * so a finger or a shaky pointer finds it. It darkens under the pointer and while dragged.
 */
export function SplitterResizeTrigger(props: SplitterResizeTriggerProps): Element {
  return <Seed.ResizeTrigger {...omit(props, "class")} class={trigger({ class: props.class })} />
}

const trigger = tv({
  base: [
    "group/trigger relative z-10 flex items-center justify-center bg-border",
    // Its color eases and its focus ring does not: a ring has to be there at once
    "transition-[background-color] duration-(--duration-smooth) ease-smooth",
    "before:absolute before:content-['']",
    "data-[orientation=horizontal]:w-3 data-[orientation=horizontal]:before:inset-y-0",
    "data-[orientation=horizontal]:before:-inset-x-[18px]",
    "data-[orientation=vertical]:h-3 data-[orientation=vertical]:before:inset-x-0",
    "data-[orientation=vertical]:before:-inset-y-[18px]",
    "hover:bg-neutral-soft data-dragging:bg-primary-soft",
    // The browser focuses the bar itself when it is pressed, which does not ring it, so the ring is the keyboard's alone
    "focus-ring",
    "data-disabled:bg-disabled",
  ],
})

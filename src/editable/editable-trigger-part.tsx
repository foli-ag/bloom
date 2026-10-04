import { tv } from "../internal/variants.js"

/** The mark of an appearing button fades in as the button grows, on `motion-press`'s pop spring */
export const editableTriggerMark =
  "size-6 shrink-0 transition-opacity duration-(--duration-smooth) ease-smooth group-data-settled/area:starting:opacity-0"

/**
 * A button at the end of the `Area`'s box, flush with it: as tall as the box with its edge, its ground clipped inside a
 * clear edge of its own so the box's edge still runs round it. It shrinks a little under the finger, and its ring takes
 * the place of its edge. Once the area has settled, a button that appears pops in where the one before it was, so the
 * pencil reads as turning into the tick and the cross.
 */
export const editableTrigger = tv({
  base: [
    "relative flex min-w-12 items-center justify-center gap-2 rounded-control border-2 border-transparent bg-clip-padding",
    "pressable motion-press focus-ring font-semibold",
    "disabled:cursor-not-allowed disabled:bg-transparent disabled:text-disabled-ink",
    "group-data-settled/area:starting:scale-(--pop-in-scale)",
  ],
  variants: {
    tone: {
      edit: "bg-primary-soft px-3 text-primary-text hover:border-primary-edge pressing:border-primary-edge",
      submit: "bg-primary text-on-primary hover:bg-primary-400 pressing:bg-primary-300",
      cancel: "bg-neutral-soft text-ink hover:border-strong pressing:border-strong",
    },
  },
})

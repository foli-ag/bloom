import { tv } from "tailwind-variants"

/**
 * The row of a checkbox, a radio and a switch: the control and its words as one target, the width of its container and
 * at least 48px tall, so a thumb that lands past the end of a short word still hits it. `class="inline-flex"` shrinks
 * it to its words where it sits in a line of text.
 *
 * A box or a circle comes first and is as tall as a line of text, so it sits on the first line of a label that wraps
 * (10px, 28px, 10px for one line). A switch comes last, at the thumb's end of the row, the way phones lay out
 * settings, and stays centered.
 */
export const choiceRow = tv({
  base: [
    "group/row flex min-h-12 pressable text-base font-medium tracking-body text-ink",
    "data-disabled:cursor-not-allowed data-disabled:text-disabled-ink",
  ],
  variants: {
    control: {
      leading: "items-start gap-3 py-2.5",
      trailing: "items-center justify-between gap-4 py-2",
    },
  },
  defaultVariants: { control: "leading" },
})

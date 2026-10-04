import { tv } from "tailwind-variants"

/** A field's parts stacked: its label, the field, and what the app puts under it */
export const fieldRoot = tv({ base: "grid gap-2" })

export const fieldLabel = tv({
  base: "text-base font-semibold tracking-body text-ink data-disabled:text-disabled-ink",
})

/**
 * The colors of a field ease on the smooth spring, its invalid line with them. The focus ring is left out: an outline
 * that eased in would show for a moment in the text color, white in the dark theme, before turning to the focus color,
 * and a ring has to be there at once anyway.
 */
export const fieldTransition =
  "transition-[border-color,background-color,color,box-shadow] duration-(--duration-smooth) ease-smooth"

/**
 * The box a farmer types in or opens: an input, a select's trigger, a combobox's input. 48px tall with a 2px edge
 * that reaches 3:1, darker under the pointer and while open. Invalid adds a second, inner line, so the change is not a
 * color alone and nothing shifts by a pixel. The line is always there, clear until it is needed, so that it fades in
 * with the edge instead of appearing before it.
 */
export const fieldBox = tv({
  base: [
    "w-full rounded-control border-2 border-strong bg-raised font-medium tracking-body text-ink",
    "shadow-[inset_0_0_0_1px_transparent]",
    fieldTransition,
    "hover:border-ink focus-visible:border-focus focus-ring",
    "data-[state=open]:border-ink",
    "aria-invalid:border-danger-text aria-invalid:shadow-[inset_0_0_0_1px_var(--color-danger-text)]",
    "data-invalid:border-danger-text data-invalid:shadow-[inset_0_0_0_1px_var(--color-danger-text)]",
    "disabled:cursor-not-allowed disabled:border-disabled disabled:bg-disabled disabled:text-disabled-ink",
  ],
  variants: {
    size: {
      md: "min-h-12 text-base",
      lg: "min-h-14 text-lg",
    },
  },
  defaultVariants: { size: "md" },
})

/**
 * The field's box drawn around an input and the parts beside it, a mark, a unit, a button, as one control: an `Input`
 * with `Input.Start` or `Input.End`, a `NumberInput` stepper, an `Editable`'s area. The input inside has no edge of its
 * own and the box takes its states, from the input or from zag's `data-*` on the box itself: darker under the pointer,
 * the ring while the input has the focus, the second line while it is invalid, greyed while it is disabled.
 *
 * The ring is the one `focus-ring` draws, over the edge, shown while a direct child that is not a button has the
 * focus, which a text field always shows. A button inside the box draws its own ring, so the keyboard is in one place.
 */
export const fieldFrame = tv({
  base: [
    "flex w-full items-stretch rounded-control border-2 border-strong bg-raised font-medium tracking-body text-ink",
    "shadow-[inset_0_0_0_1px_transparent]",
    fieldTransition,
    "hover:border-ink has-[>:focus-visible:not(button)]:border-focus",
    "has-[>:focus-visible:not(button)]:[outline:3px_var(--focus-style,solid)_var(--color-focus)]",
    "has-[>:focus-visible:not(button)]:[outline-offset:calc(var(--focus-inset,3px)*-1)]",
    "data-invalid:border-danger-text data-invalid:shadow-[inset_0_0_0_1px_var(--color-danger-text)]",
    "has-[>input[aria-invalid=true]]:border-danger-text",
    "has-[>input[aria-invalid=true]]:shadow-[inset_0_0_0_1px_var(--color-danger-text)]",
    "data-disabled:cursor-not-allowed data-disabled:border-disabled data-disabled:bg-disabled data-disabled:text-disabled-ink",
    "has-[>input:disabled]:cursor-not-allowed has-[>input:disabled]:border-disabled has-[>input:disabled]:bg-disabled",
    "has-[>input:disabled]:text-disabled-ink",
  ],
  variants: {
    size: {
      md: "min-h-12 text-base",
      lg: "min-h-14 text-lg",
    },
  },
  defaultVariants: { size: "md" },
})

/**
 * The input inside a `fieldFrame`: no edge, no ground and no ring of its own, as the frame draws them, and the height of
 * the frame, so a press anywhere on its line lands in it. A search field's own clear cross, small and in the browser's
 * blue, gives way to a button the app puts in the box with words.
 */
export const fieldFrameInput = tv({
  base: [
    "min-w-0 flex-1 self-stretch bg-transparent px-4 py-2 text-inherit outline-none",
    "placeholder:text-muted disabled:cursor-not-allowed disabled:placeholder:text-disabled-ink",
    "[&::-webkit-search-cancel-button]:appearance-none",
  ],
})

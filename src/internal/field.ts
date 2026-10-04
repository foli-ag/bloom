import { tv } from "tailwind-variants"

/** A field's parts stacked: its label, the field, and what the app puts under it */
export const fieldRoot = tv({ base: "grid gap-2" })

export const fieldLabel = tv({
  base: "text-base font-semibold tracking-body text-ink data-disabled:text-disabled-ink",
})

/**
 * The box a farmer types in or opens: an input, a select's trigger, a combobox's input. 48px tall with a 2px edge
 * that reaches 3:1, darker under the pointer and while open. Invalid adds a second, inner line, so the change is not a
 * color alone and nothing shifts by a pixel.
 */
export const fieldBox = tv({
  base: [
    "w-full rounded-control border-2 border-strong bg-raised font-medium tracking-body text-ink",
    "transition-colors duration-(--duration-smooth) ease-smooth hover:border-ink focus-visible:border-ink focus-ring",
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

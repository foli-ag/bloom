import { tv } from "tailwind-variants"

/**
 * A row of the tree, a branch's control or an item: 48px tall, stepped in by 24px a level from the `--depth` zag sets
 * on the node. An item has no chevron and keeps the chevron's room before its words, so the words of one level line
 * up. It is tinted under the pointer, at once under the finger, and while selected, and a selected row's words turn
 * bold, so the selection is not a color alone. The ring is drawn inside the row and appears at once: only the colors
 * underneath ease. There is no `outline-none` on the row: in Tailwind 4 it sets the outline's style to none for the
 * `outline-3` of the ring too, which would then never show.
 */
export const row = tv({
  base: [
    "flex min-h-12 w-full pressable items-center gap-3 rounded-control py-2 pe-3 text-start",
    "text-base font-medium tracking-body text-ink",
    "transition-[color,background-color] duration-[var(--press-duration,var(--duration-smooth))]",
    "ease-[var(--press-ease,var(--ease-smooth))]",
    "hover:bg-neutral-soft active:bg-[color-mix(in_oklab,var(--color-neutral-soft),var(--color-ink)_8%)]",
    "focus-ring [--focus-inset:3px]",
    "data-selected:bg-primary-soft data-selected:font-semibold",
    "data-disabled:cursor-not-allowed data-disabled:text-disabled-ink",
    "data-disabled:hover:bg-transparent data-disabled:active:bg-transparent",
  ],
  variants: {
    // The chevron is 20px with a 12px gap after it
    leaf: {
      false: "ps-[calc((var(--depth,1)-1)*1.5rem+0.75rem)]",
      true: "ps-[calc((var(--depth,1)-1)*1.5rem+2.75rem)]",
    },
  },
  defaultVariants: { leaf: false },
})

/** The words of a row, which take the room left by the marks around them */
export const rowText = tv({ base: "min-w-0 flex-1" })

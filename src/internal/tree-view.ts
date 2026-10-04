import { tv } from "tailwind-variants"

/**
 * A row of the tree, a branch's control or an item: 48px tall, stepped in by 24px a level from the `--depth` zag sets
 * on the node. It is tinted under the finger and while selected, and a selected row's words turn bold, so the
 * selection is not a color alone.
 */
export const row = tv({
  base: [
    "flex min-h-12 w-full pressable items-center gap-3 rounded-control py-2 pe-3 text-start",
    "ps-[calc((var(--depth,1)-1)*1.5rem+0.75rem)]",
    "text-base font-medium tracking-body text-ink outline-none",
    "transition-colors duration-(--duration-smooth) ease-smooth hover:bg-neutral-soft",
    "focus-visible:outline-3 focus-visible:-outline-offset-3 focus-visible:outline-focus",
    "data-selected:bg-primary-soft data-selected:font-semibold",
    "data-disabled:cursor-not-allowed data-disabled:text-disabled-ink data-disabled:hover:bg-transparent",
  ],
})

/** The words of a row, which take the room left by the marks around them */
export const rowText = tv({ base: "min-w-0 flex-1" })

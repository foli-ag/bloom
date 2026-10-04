import { tv } from "tailwind-variants"

/**
 * The look of a card: a raised surface, the rounded corners of a card and a 2px edge. A card, a collapsible drawn as a
 * card, an accordion whose sections stand apart and a choice drawn as a tile all share it, so they sit together on a
 * page. The edge is the strong one, 3:1 against the page, on anything a finger has to find, and the quiet one on a
 * card that only holds content, where a page of them would otherwise look caged.
 */
export const cardSurface = tv({
  base: "rounded-card border-2 bg-raised text-ink",
  variants: {
    edge: {
      strong: "border-strong",
      quiet: "border-border",
    },
  },
  defaultVariants: { edge: "strong" },
})

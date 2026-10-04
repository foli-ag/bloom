import { tv } from "tailwind-variants"

/**
 * The look of a badge, shared with the chips of a select and a combobox, so a status in a list and a choice in a field
 * read as the same thing: a short label on a tint, a fill or an edge, in the colors of its tone.
 *
 * Every variant keeps a 2px edge, clear where it has none to show, so a soft, a solid and an outlined badge of the same
 * words are the same size and line up in a row. Success is the primary green, as everywhere in bloom, and each tone's
 * words reach 7:1 on its ground in both themes. A warning's fill is too light to show on a light page, so it carries
 * the edge of its text, as a warning shape does elsewhere.
 */
export const badgeLook = tv({
  base: "inline-flex max-w-full items-center rounded-box border-2 font-semibold tracking-body whitespace-nowrap",
  variants: {
    tone: { neutral: "", primary: "", success: "", info: "", warning: "", danger: "" },
    variant: {
      soft: "border-transparent",
      solid: "",
      outline: "bg-transparent",
    },
  },
  compoundVariants: [
    { tone: "neutral", variant: "soft", class: "bg-neutral-soft text-ink" },
    { tone: "neutral", variant: "solid", class: "border-ink bg-ink text-surface" },
    { tone: "neutral", variant: "outline", class: "border-strong text-ink" },
    { tone: ["primary", "success"], variant: "soft", class: "bg-primary-soft text-primary-text" },
    { tone: ["primary", "success"], variant: "solid", class: "border-primary-edge bg-primary text-on-primary" },
    { tone: ["primary", "success"], variant: "outline", class: "border-primary-edge text-primary-text" },
    { tone: "info", variant: "soft", class: "bg-info-soft text-info-text" },
    { tone: "info", variant: "solid", class: "border-info bg-info text-on-info" },
    { tone: "info", variant: "outline", class: "border-info-text text-info-text" },
    { tone: "warning", variant: "soft", class: "bg-warning-soft text-warning-text" },
    { tone: "warning", variant: "solid", class: "border-warning-text bg-warning text-on-warning" },
    { tone: "warning", variant: "outline", class: "border-warning-text text-warning-text" },
    { tone: "danger", variant: "soft", class: "bg-danger-soft text-danger-text" },
    { tone: "danger", variant: "solid", class: "border-danger bg-danger text-on-danger" },
    { tone: "danger", variant: "outline", class: "border-danger-text text-danger-text" },
  ],
  defaultVariants: { tone: "neutral", variant: "soft" },
})

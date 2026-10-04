import { tv } from "tailwind-variants"

/**
 * The chevron of an `Indicator` part: a collapsible's, an accordion item's, a select's, a menu's, a popover's. It
 * turns on the smooth spring as what it belongs to opens, reading the part's own `data-state`. It is a `span`, so it
 * can sit inside a button.
 */
export const indicatorChevron = tv({
  base: [
    "inline-flex shrink-0 transition-[rotate] duration-(--duration-smooth) ease-smooth",
    "data-[state=open]:rotate-180",
  ],
})

/**
 * The content of a collapsible and of an accordion item. It grows to its height as it opens and folds back as it
 * closes. Under reduced motion it only fades. Padding goes on an element inside the content, which would otherwise
 * show at a height of zero.
 */
export const disclosureContent = tv({
  base: "overflow-hidden data-[state=closed]:animate-collapse-close data-[state=open]:animate-collapse-open",
})

/**
 * A chevron drawn inside a trigger that has no `Indicator` part of its own: a navigation section's, a combobox's
 * field. It turns with the `data-state` of the element marked `group/trigger` around it.
 */
export const triggerChevron = tv({
  base: [
    "size-5 shrink-0 transition-[rotate] duration-(--duration-smooth) ease-smooth",
    "group-data-[state=open]/trigger:rotate-180",
  ],
})

import { tv } from "tailwind-variants"

/**
 * The chevron of an `Indicator` part: a collapsible's, an accordion item's, a select's, a menu's, a popover's. It
 * turns on the smooth spring as what it belongs to opens, reading the part's own `data-state`, and turns back as fast as
 * that leaves. Under reduced motion it turns at once. It is a `span`, so it can sit inside a button.
 */
export const indicatorChevron = tv({
  base: [
    "inline-flex shrink-0 transition-[rotate] ease-smooth",
    "duration-[calc(var(--duration-smooth)*var(--chevron-turn,1))] data-[state=open]:rotate-180",
    "data-[state=closed]:duration-[calc(var(--collapse-exit-duration,var(--duration-exit))*var(--chevron-turn,1))]",
  ],
})

/**
 * The content of a collapsible, of an accordion item and of a tree branch. It folds open to its height and back, a fade
 * under reduced motion (`presence-collapse`). The part puts one element of its own inside it, which clips while it
 * folds: padding and layout go on that element or inside it, as they would show at a height of zero on the content.
 */
export const disclosureContent = tv({ base: "presence-collapse" })

/**
 * A chevron drawn inside a trigger that has no `Indicator` part of its own: a navigation section's, a combobox's
 * field. It turns with the `data-state` of the element marked `group/trigger` around it. It is the <svg> itself, so it
 * turns by `transform`: Chromium runs `rotate` and `scale` on an <svg> on the main thread, where a busy page stalls them.
 */
export const triggerChevron = tv({
  base: [
    "size-5 shrink-0 transition-[transform] ease-smooth",
    "duration-[calc(var(--duration-smooth)*var(--chevron-turn,1))] group-data-[state=open]/trigger:[transform:rotate(180deg)]",
    "group-data-[state=closed]/trigger:duration-[calc(var(--collapse-exit-duration,var(--duration-exit))*var(--chevron-turn,1))]",
  ],
})

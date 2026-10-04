import { HoverCard as Seed } from "@foliag/seeds/hover-card"
import type { Element } from "solid-js"

export type HoverCardRootProps = Omit<Seed.RootProps, "lazyMount" | "unmountOnExit">

/**
 * A card about what a link points to, such as a parcel or a person, shown once a mouse has rested on the link (after
 * `openDelay`) or when the keyboard reaches it. It stays open while the pointer moves onto it.
 *
 * Like a tooltip it never opens from a touch, and a tap follows the link. On a phone a farmer never sees it, so it
 * only adds to the page the link leads to, never replaces it.
 *
 * @example
 * <HoverCard.Root>
 *   <HoverCard.Trigger as="a" href="/parcelles/grands-champs">Les Grands Champs</HoverCard.Trigger>
 *   <HoverCard.Positioner>
 *     <HoverCard.Content>
 *       <HoverCard.Arrow>
 *         <HoverCard.Arrow.Tip />
 *       </HoverCard.Arrow>
 *       <p>Blé tendre, 12,4 ha</p>
 *     </HoverCard.Content>
 *   </HoverCard.Positioner>
 * </HoverCard.Root>
 */
export function HoverCardRoot(props: HoverCardRootProps): Element {
  return <Seed.Root {...props} lazyMount unmountOnExit />
}

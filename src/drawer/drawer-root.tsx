import { Drawer as Seed } from "@foliag/seeds/drawer"
import type { Element } from "solid-js"

export type DrawerRootProps = Omit<Seed.RootProps, "lazyMount" | "unmountOnExit">

/**
 * A panel that rises from the bottom edge over the page, such as filters or the details of a parcel, and follows the
 * thumb: swiped down past a point it closes, let go before that it settles back. With `snapPoints` it can also rest
 * half open. Focus moves into it and stays there, Escape and a tap on the dim close it, and focus then goes back to
 * the trigger. Its parts mount when it opens and leave once it has closed.
 *
 * Swiping is not the only way out: give it a `Trigger.Close` with words, because a gesture is not obvious to everyone.
 * `swipeDirection` puts it on another edge.
 *
 * @example
 * <Drawer.Root>
 *   <Drawer.Trigger as={Button} variant="outline">Filtrer</Drawer.Trigger>
 *   <Drawer.Backdrop />
 *   <Drawer.Positioner>
 *     <Drawer.Content>
 *       <Drawer.Grabber>
 *         <Drawer.Grabber.Indicator />
 *       </Drawer.Grabber>
 *       <Drawer.Title>Filtrer les parcelles</Drawer.Title>
 *       <Drawer.Description>Par culture et par îlot.</Drawer.Description>
 *       …
 *       <Drawer.Trigger.Close as={Button} tone="neutral" variant="outline" block>Fermer</Drawer.Trigger.Close>
 *     </Drawer.Content>
 *   </Drawer.Positioner>
 * </Drawer.Root>
 */
export function DrawerRoot(props: DrawerRootProps): Element {
  return <Seed.Root {...props} lazyMount unmountOnExit />
}

import { Tooltip as Seed } from "@foliag/seeds/tooltip"
import type { Element } from "solid-js"

export type TooltipRootProps = Omit<Seed.RootProps, "lazyMount" | "unmountOnExit">

/**
 * A few words next to a control that describe it, shown when a mouse rests on it (after `openDelay`) or at once when
 * the keyboard reaches it. Escape hides it. It is announced as the control's description.
 *
 * It never opens from a touch: zag ignores touch on purpose, as a tap already presses the control. On a phone a farmer
 * never sees it, so it is an extra for a mouse and a keyboard. What has to be read belongs next to the control, or in
 * a `Popover` that a tap opens.
 *
 * @example
 * <Tooltip.Root>
 *   <Tooltip.Trigger as={Button} variant="ghost">Exporter</Tooltip.Trigger>
 *   <Tooltip.Positioner>
 *     <Tooltip.Content>
 *       <Tooltip.Arrow>
 *         <Tooltip.Arrow.Tip />
 *       </Tooltip.Arrow>
 *       Au format de la PAC
 *     </Tooltip.Content>
 *   </Tooltip.Positioner>
 * </Tooltip.Root>
 */
export function TooltipRoot(props: TooltipRootProps): Element {
  return <Seed.Root {...props} lazyMount unmountOnExit />
}

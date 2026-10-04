import { HoverCard as Seed } from "@foliag/seeds/hover-card"
import type { ValidComponent } from "@foliag/seeds/polymorphic"
import { HoverCardArrow } from "./hover-card-arrow.jsx"
import { HoverCardArrowTip } from "./hover-card-arrow-tip.jsx"

export type { HoverCardArrowProps as ArrowProps } from "./hover-card-arrow.jsx"
export type { HoverCardArrowTipProps as ArrowTipProps } from "./hover-card-arrow-tip.jsx"
export { HoverCardContent as Content, type HoverCardContentProps as ContentProps } from "./hover-card-content.jsx"
export {
  HoverCardPositioner as Positioner,
  type HoverCardPositionerProps as PositionerProps,
} from "./hover-card-positioner.jsx"
export { HoverCardRoot as Root, type HoverCardRootProps as RootProps } from "./hover-card-root.jsx"
export {
  HoverCardRootProvider as RootProvider,
  type HoverCardRootProviderProps as RootProviderProps,
} from "./hover-card-root-provider.jsx"
export type ContextProps = Seed.ContextProps
export type OpenChangeDetails = Seed.OpenChangeDetails
export type PositioningOptions = Seed.PositioningOptions
export type TriggerValueChangeDetails = Seed.TriggerValueChangeDetails
export type TriggerProps<As extends ValidComponent = "button"> = Seed.TriggerProps<As>

export const Arrow = /* @__PURE__ */ Object.assign(HoverCardArrow, { Tip: HoverCardArrowTip })

// Seeds' own, with no look: render the trigger as the link it is about
export const Trigger: typeof Seed.Trigger = Seed.Trigger
export const Context: typeof Seed.Context = Seed.Context

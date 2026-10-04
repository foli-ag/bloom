import type { ValidComponent } from "@foliag/seeds/polymorphic"
import { Tooltip as Seed } from "@foliag/seeds/tooltip"
import { TooltipArrow } from "./tooltip-arrow.jsx"
import { TooltipArrowTip } from "./tooltip-arrow-tip.jsx"

export type { TooltipArrowProps as ArrowProps } from "./tooltip-arrow.jsx"
export type { TooltipArrowTipProps as ArrowTipProps } from "./tooltip-arrow-tip.jsx"
export { TooltipContent as Content, type TooltipContentProps as ContentProps } from "./tooltip-content.jsx"
export {
  TooltipPositioner as Positioner,
  type TooltipPositionerProps as PositionerProps,
} from "./tooltip-positioner.jsx"
export { TooltipRoot as Root, type TooltipRootProps as RootProps } from "./tooltip-root.jsx"
export {
  TooltipRootProvider as RootProvider,
  type TooltipRootProviderProps as RootProviderProps,
} from "./tooltip-root-provider.jsx"
export type ContextProps = Seed.ContextProps
export type OpenChangeDetails = Seed.OpenChangeDetails
export type PositioningOptions = Seed.PositioningOptions
export type TriggerValueChangeDetails = Seed.TriggerValueChangeDetails
export type TriggerProps<As extends ValidComponent = "button"> = Seed.TriggerProps<As>

export const Arrow = /* @__PURE__ */ Object.assign(TooltipArrow, { Tip: TooltipArrowTip })

// Seeds' own, with no look: render the trigger as the control it describes, usually a `Button`
export const Trigger: typeof Seed.Trigger = Seed.Trigger
export const Context: typeof Seed.Context = Seed.Context

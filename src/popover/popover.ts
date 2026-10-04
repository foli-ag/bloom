import type { ValidComponent } from "@foliag/seeds/polymorphic"
import { Popover as Seed } from "@foliag/seeds/popover"

export { PopoverActions as Actions, type PopoverActionsProps as ActionsProps } from "./popover-actions.jsx"
export { PopoverContent as Content, type PopoverContentProps as ContentProps } from "./popover-content.jsx"
export {
  PopoverDescription as Description,
  type PopoverDescriptionProps as DescriptionProps,
} from "./popover-description.jsx"
export { PopoverIndicator as Indicator, type PopoverIndicatorProps as IndicatorProps } from "./popover-indicator.jsx"
export {
  PopoverPositioner as Positioner,
  type PopoverPositionerProps as PositionerProps,
} from "./popover-positioner.jsx"
export { PopoverRoot as Root, type PopoverRootProps as RootProps } from "./popover-root.jsx"
export { PopoverTitle as Title, type PopoverTitleProps as TitleProps } from "./popover-title.jsx"
export type AnchorProps<As extends ValidComponent = "div"> = Seed.AnchorProps<As>
export type ContextProps = Seed.ContextProps
export type OpenChangeDetails = Seed.OpenChangeDetails
export type PositioningOptions = Seed.PositioningOptions
export type RootProviderProps = Seed.RootProviderProps
export type TriggerProps<As extends ValidComponent = "button"> = Seed.TriggerProps<As>
export type TriggerCloseProps<As extends ValidComponent = "button"> = Seed.TriggerCloseProps<As>

// Seeds' own, with no look. A trigger renders as a `Button`.
export const Anchor: typeof Seed.Anchor = Seed.Anchor
export const Context: typeof Seed.Context = Seed.Context
export const RootProvider: typeof Seed.RootProvider = Seed.RootProvider
export const Trigger: typeof Seed.Trigger = Seed.Trigger

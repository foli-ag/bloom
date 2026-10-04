import { Drawer as Seed } from "@foliag/seeds/drawer"
import type { ValidComponent } from "@foliag/seeds/polymorphic"
import { DrawerGrabber } from "./drawer-grabber.jsx"
import { DrawerGrabberIndicator } from "./drawer-grabber-indicator.jsx"

export { DrawerBackdrop as Backdrop, type DrawerBackdropProps as BackdropProps } from "./drawer-backdrop.jsx"
export { DrawerContent as Content, type DrawerContentProps as ContentProps } from "./drawer-content.jsx"
export {
  DrawerDescription as Description,
  type DrawerDescriptionProps as DescriptionProps,
} from "./drawer-description.jsx"
export type { DrawerGrabberProps as GrabberProps } from "./drawer-grabber.jsx"
export type { DrawerGrabberIndicatorProps as GrabberIndicatorProps } from "./drawer-grabber-indicator.jsx"
export { DrawerPositioner as Positioner, type DrawerPositionerProps as PositionerProps } from "./drawer-positioner.jsx"
export { DrawerRoot as Root, type DrawerRootProps as RootProps } from "./drawer-root.jsx"
export {
  DrawerRootProvider as RootProvider,
  type DrawerRootProviderProps as RootProviderProps,
} from "./drawer-root-provider.jsx"
export { DrawerTitle as Title, type DrawerTitleProps as TitleProps } from "./drawer-title.jsx"
export type ContextProps = Seed.ContextProps
export type OpenChangeDetails = Seed.OpenChangeDetails
export type SnapPoint = Seed.SnapPoint
export type SnapPointChangeDetails = Seed.SnapPointChangeDetails
export type SwipeDirection = Seed.SwipeDirection
export type TriggerValueChangeDetails = Seed.TriggerValueChangeDetails
export type TriggerProps<As extends ValidComponent = "button"> = Seed.TriggerProps<As>
export type TriggerCloseProps<As extends ValidComponent = "button"> = Seed.TriggerCloseProps<As>

export const Grabber = /* @__PURE__ */ Object.assign(DrawerGrabber, { Indicator: DrawerGrabberIndicator })

// Seeds' own, with no look: render them as a `Button`
export const Trigger: typeof Seed.Trigger = Seed.Trigger
export const Context: typeof Seed.Context = Seed.Context

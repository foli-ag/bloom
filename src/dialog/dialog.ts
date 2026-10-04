import { Dialog as Seed } from "@foliag/seeds/dialog"
import type { ValidComponent } from "@foliag/seeds/polymorphic"

export { DialogActions as Actions, type DialogActionsProps as ActionsProps } from "./dialog-actions.jsx"
export { DialogBackdrop as Backdrop, type DialogBackdropProps as BackdropProps } from "./dialog-backdrop.jsx"
export { DialogContent as Content, type DialogContentProps as ContentProps } from "./dialog-content.jsx"
export {
  DialogDescription as Description,
  type DialogDescriptionProps as DescriptionProps,
} from "./dialog-description.jsx"
export { DialogPositioner as Positioner, type DialogPositionerProps as PositionerProps } from "./dialog-positioner.jsx"
export { DialogRoot as Root, type DialogRootProps as RootProps } from "./dialog-root.jsx"
export type { DialogPhone as Phone, DialogSize as Size } from "./dialog-look.js"
export {
  DialogRootProvider as RootProvider,
  type DialogRootProviderProps as RootProviderProps,
} from "./dialog-root-provider.jsx"
export { DialogTitle as Title, type DialogTitleProps as TitleProps } from "./dialog-title.jsx"
export type ContextProps = Seed.ContextProps
export type OpenChangeDetails = Seed.OpenChangeDetails
export type TriggerValueChangeDetails = Seed.TriggerValueChangeDetails
export type TriggerProps<As extends ValidComponent = "button"> = Seed.TriggerProps<As>
export type TriggerCloseProps<As extends ValidComponent = "button"> = Seed.TriggerCloseProps<As>

// Seeds' own, with no look: render them as a `Button`
export const Trigger: typeof Seed.Trigger = Seed.Trigger
export const Context: typeof Seed.Context = Seed.Context

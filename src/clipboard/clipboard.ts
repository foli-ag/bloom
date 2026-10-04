import { Clipboard as Seed } from "@foliag/seeds/clipboard"
import type { ValidComponent } from "@foliag/seeds/polymorphic"

export { ClipboardControl as Control, type ClipboardControlProps as ControlProps } from "./clipboard-control.jsx"
export {
  ClipboardIndicator as Indicator,
  type ClipboardIndicatorProps as IndicatorProps,
} from "./clipboard-indicator.jsx"
export { ClipboardInput as Input, type ClipboardInputProps as InputProps } from "./clipboard-input.jsx"
export { ClipboardLabel as Label, type ClipboardLabelProps as LabelProps } from "./clipboard-label.jsx"
export { ClipboardRoot as Root, type ClipboardRootProps as RootProps } from "./clipboard-root.jsx"
export {
  ClipboardRootProvider as RootProvider,
  type ClipboardRootProviderProps as RootProviderProps,
} from "./clipboard-root-provider.jsx"
export {
  ClipboardValueText as ValueText,
  type ClipboardValueTextProps as ValueTextProps,
} from "./clipboard-value-text.jsx"
export type ContextProps = Seed.ContextProps
export type TriggerProps<As extends ValidComponent = "button"> = Seed.TriggerProps<As>
export type CopyStatusDetails = Seed.CopyStatusDetails
export type ValueChangeDetails = Seed.ValueChangeDetails

// Seeds' own, with no look. The trigger renders as a `Button`.
export const Trigger: typeof Seed.Trigger = Seed.Trigger
export const Context: typeof Seed.Context = Seed.Context

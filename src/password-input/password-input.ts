import { PasswordInput as Seed } from "@foliag/seeds/password-input"

export {
  PasswordInputControl as Control,
  type PasswordInputControlProps as ControlProps,
} from "./password-input-control.jsx"
export {
  PasswordInputIndicator as Indicator,
  type PasswordInputIndicatorProps as IndicatorProps,
} from "./password-input-indicator.jsx"
export { PasswordInputInput as Input, type PasswordInputInputProps as InputProps } from "./password-input-input.jsx"
export { PasswordInputLabel as Label, type PasswordInputLabelProps as LabelProps } from "./password-input-label.jsx"
export { PasswordInputRoot as Root, type PasswordInputRootProps as RootProps } from "./password-input-root.jsx"
export {
  PasswordInputRootProvider as RootProvider,
  type PasswordInputRootProviderProps as RootProviderProps,
} from "./password-input-root-provider.jsx"
export type ContextProps = Seed.ContextProps
export type VisibilityChangeDetails = Seed.VisibilityChangeDetails

// Seeds' own, with no look. The button renders as a `Button`.
export const Trigger: typeof Seed.Trigger = Seed.Trigger
export const Context: typeof Seed.Context = Seed.Context

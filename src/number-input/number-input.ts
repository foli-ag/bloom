import { NumberInput as Seed } from "@foliag/seeds/number-input"

export { NumberInputControl as Control, type NumberInputControlProps as ControlProps } from "./number-input-control.jsx"
export { NumberInputInput as Input, type NumberInputInputProps as InputProps } from "./number-input-input.jsx"
export { NumberInputLabel as Label, type NumberInputLabelProps as LabelProps } from "./number-input-label.jsx"
export { NumberInputRoot as Root, type NumberInputRootProps as RootProps } from "./number-input-root.jsx"
export {
  NumberInputRootProvider as RootProvider,
  type NumberInputRootProviderProps as RootProviderProps,
} from "./number-input-root-provider.jsx"
export type ContextProps = Seed.ContextProps
export type FocusChangeDetails = Seed.FocusChangeDetails
export type ValueChangeDetails = Seed.ValueChangeDetails
export type ValueInvalidDetails = Seed.ValueInvalidDetails

// Seeds' own, with no look. The buttons render as a `Button`.
export const Trigger: typeof Seed.Trigger = Seed.Trigger
export const Context: typeof Seed.Context = Seed.Context

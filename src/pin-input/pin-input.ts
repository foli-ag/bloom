import { PinInput as Seed } from "@foliag/seeds/pin-input"

export { PinInputControl as Control, type PinInputControlProps as ControlProps } from "./pin-input-control.jsx"
export { PinInputInput as Input, type PinInputInputProps as InputProps } from "./pin-input-input.jsx"
export { PinInputLabel as Label, type PinInputLabelProps as LabelProps } from "./pin-input-label.jsx"
export { PinInputRoot as Root, type PinInputRootProps as RootProps } from "./pin-input-root.jsx"
export {
  PinInputRootProvider as RootProvider,
  type PinInputRootProviderProps as RootProviderProps,
} from "./pin-input-root-provider.jsx"
export type ContextProps = Seed.ContextProps
export type HiddenInputProps = Seed.HiddenInputProps
export type ValueChangeDetails = Seed.ValueChangeDetails
export type ValueInvalidDetails = Seed.ValueInvalidDetails

// Seeds' own, with no look
export const HiddenInput: typeof Seed.HiddenInput = Seed.HiddenInput
export const Context: typeof Seed.Context = Seed.Context

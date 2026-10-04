import { Editable as Seed } from "@foliag/seeds/editable"

export { EditableArea as Area, type EditableAreaProps as AreaProps } from "./editable-area.jsx"
export { EditableControl as Control, type EditableControlProps as ControlProps } from "./editable-control.jsx"
export { EditableInput as Input, type EditableInputProps as InputProps } from "./editable-input.jsx"
export { EditableLabel as Label, type EditableLabelProps as LabelProps } from "./editable-label.jsx"
export { EditablePreview as Preview, type EditablePreviewProps as PreviewProps } from "./editable-preview.jsx"
export { EditableRoot as Root, type EditableRootProps as RootProps } from "./editable-root.jsx"
export {
  EditableRootProvider as RootProvider,
  type EditableRootProviderProps as RootProviderProps,
} from "./editable-root-provider.jsx"
export type ContextProps = Seed.ContextProps
export type ActivationMode = Seed.ActivationMode
export type EditChangeDetails = Seed.EditChangeDetails
export type SubmitMode = Seed.SubmitMode
export type ValueChangeDetails = Seed.ValueChangeDetails

// The buttons at the end of the area's box: a pencil, a tick and a cross, named by their words
export * as Trigger from "./editable-trigger.js"
export const Context: typeof Seed.Context = Seed.Context

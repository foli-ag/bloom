import { Combobox as Seed } from "@foliag/seeds/combobox"
import { ComboboxChip } from "./combobox-chip.jsx"
import { ComboboxChipText } from "./combobox-chip-text.jsx"
import { ComboboxChipTrigger } from "./combobox-chip-trigger.jsx"
import { ComboboxGroup } from "./combobox-group.jsx"
import { ComboboxGroupLabel } from "./combobox-group-label.jsx"
import { ComboboxItem } from "./combobox-item.jsx"
import { ComboboxItemIndicator } from "./combobox-item-indicator.jsx"
import { ComboboxItemText } from "./combobox-item-text.jsx"
import { ComboboxTrigger } from "./combobox-trigger.jsx"
import { ComboboxTriggerClear } from "./combobox-trigger-clear.jsx"

export type { ComboboxChipProps as ChipProps } from "./combobox-chip.jsx"
export {
  ComboboxChipGroup as ChipGroup,
  type ComboboxChipGroupProps as ChipGroupProps,
} from "./combobox-chip-group.jsx"
export type { ComboboxChipTextProps as ChipTextProps } from "./combobox-chip-text.jsx"
export type { ComboboxChipTriggerProps as ChipTriggerProps } from "./combobox-chip-trigger.jsx"
export { ComboboxContent as Content, type ComboboxContentProps as ContentProps } from "./combobox-content.jsx"
export { ComboboxControl as Control, type ComboboxControlProps as ControlProps } from "./combobox-control.jsx"
export { ComboboxEmpty as Empty, type ComboboxEmptyProps as EmptyProps } from "./combobox-empty.jsx"
export type { ComboboxGroupProps as GroupProps } from "./combobox-group.jsx"
export type { ComboboxGroupLabelProps as GroupLabelProps } from "./combobox-group-label.jsx"
export {
  ComboboxIndicator as Indicator,
  type ComboboxIndicatorProps as IndicatorProps,
} from "./combobox-indicator.jsx"
export { ComboboxInput as Input, type ComboboxInputProps as InputProps } from "./combobox-input.jsx"
export type { ComboboxItemProps as ItemProps } from "./combobox-item.jsx"
export type { ComboboxItemIndicatorProps as ItemIndicatorProps } from "./combobox-item-indicator.jsx"
export type { ComboboxItemTextProps as ItemTextProps } from "./combobox-item-text.jsx"
export { ComboboxLabel as Label, type ComboboxLabelProps as LabelProps } from "./combobox-label.jsx"
export { ComboboxLoading as Loading, type ComboboxLoadingProps as LoadingProps } from "./combobox-loading.jsx"
export {
  ComboboxPositioner as Positioner,
  type ComboboxPositionerProps as PositionerProps,
} from "./combobox-positioner.jsx"
export { ComboboxRoot as Root, type ComboboxRootProps as RootProps } from "./combobox-root.jsx"
export type { ComboboxTriggerProps as TriggerProps } from "./combobox-trigger.jsx"
export type { ComboboxTriggerClearProps as TriggerClearProps } from "./combobox-trigger-clear.jsx"
export type ContextProps = Seed.ContextProps
export type InputValueChangeDetails = Seed.InputValueChangeDetails
export type OpenChangeDetails = Seed.OpenChangeDetails
export type ValueChangeDetails<T = any> = Seed.ValueChangeDetails<T>

export const Trigger = /* @__PURE__ */ Object.assign(ComboboxTrigger, {
  Open: ComboboxTrigger,
  Clear: ComboboxTriggerClear,
})

export const Item = /* @__PURE__ */ Object.assign(ComboboxItem, {
  Text: ComboboxItemText,
  Indicator: ComboboxItemIndicator,
})

export const Group = /* @__PURE__ */ Object.assign(ComboboxGroup, { Label: ComboboxGroupLabel })

export const Chip = /* @__PURE__ */ Object.assign(ComboboxChip, {
  Text: ComboboxChipText,
  Trigger: ComboboxChipTrigger,
})

// Seeds' own, with no look
export const Context: typeof Seed.Context = Seed.Context

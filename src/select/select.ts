import { Select as Seed } from "@foliag/seeds/select"
import { SelectChip } from "./select-chip.jsx"
import { SelectChipText } from "./select-chip-text.jsx"
import { SelectChipTrigger } from "./select-chip-trigger.jsx"
import { SelectGroup } from "./select-group.jsx"
import { SelectGroupLabel } from "./select-group-label.jsx"
import { SelectItem } from "./select-item.jsx"
import { SelectItemContext } from "./select-item-context.jsx"
import { SelectItemIndicator } from "./select-item-indicator.jsx"
import { SelectItemText } from "./select-item-text.jsx"
import { SelectTrigger } from "./select-trigger.jsx"
import { SelectTriggerClear } from "./select-trigger-clear.jsx"
import { SelectTriggerClose } from "./select-trigger-close.jsx"

export type { SelectChipProps as ChipProps } from "./select-chip.jsx"
export {
  SelectChipGroup as ChipGroup,
  type SelectChipGroupProps as ChipGroupProps,
} from "./select-chip-group.jsx"
export type { SelectChipTextProps as ChipTextProps } from "./select-chip-text.jsx"
export type { SelectChipTriggerProps as ChipTriggerProps } from "./select-chip-trigger.jsx"
export { SelectContent as Content, type SelectContentProps as ContentProps } from "./select-content.jsx"
export { SelectControl as Control, type SelectControlProps as ControlProps } from "./select-control.jsx"
export type { SelectGroupProps as GroupProps } from "./select-group.jsx"
export type { SelectGroupLabelProps as GroupLabelProps } from "./select-group-label.jsx"
export { SelectIndicator as Indicator, type SelectIndicatorProps as IndicatorProps } from "./select-indicator.jsx"
export type { SelectItemProps as ItemProps } from "./select-item.jsx"
export type { SelectItemContextProps as ItemContextProps } from "./select-item-context.jsx"
export type { SelectItemIndicatorProps as ItemIndicatorProps } from "./select-item-indicator.jsx"
export type { SelectItemTextProps as ItemTextProps } from "./select-item-text.jsx"
export { SelectLoading as Loading, type SelectLoadingProps as LoadingProps } from "./select-loading.jsx"
export { SelectLabel as Label, type SelectLabelProps as LabelProps } from "./select-label.jsx"
export { SelectPositioner as Positioner, type SelectPositionerProps as PositionerProps } from "./select-positioner.jsx"
export { SelectRoot as Root, type SelectRootProps as RootProps } from "./select-root.jsx"
export {
  SelectRootProvider as RootProvider,
  type SelectRootProviderProps as RootProviderProps,
} from "./select-root-provider.jsx"
export type { SelectTriggerProps as TriggerProps } from "./select-trigger.jsx"
export type { SelectTriggerClearProps as TriggerClearProps } from "./select-trigger-clear.jsx"
export type { SelectTriggerCloseProps as TriggerCloseProps } from "./select-trigger-close.jsx"
export { SelectValueText as ValueText, type SelectValueTextProps as ValueTextProps } from "./select-value-text.jsx"
export type ContextProps = Seed.ContextProps
export type HiddenSelectProps = Seed.HiddenSelectProps
export type HighlightChangeDetails = Seed.HighlightChangeDetails
export type OpenChangeDetails = Seed.OpenChangeDetails
export type ValueChangeDetails<T = any> = Seed.ValueChangeDetails<T>

export const Trigger = /* @__PURE__ */ Object.assign(SelectTrigger, {
  Open: SelectTrigger,
  Clear: SelectTriggerClear,
  Close: SelectTriggerClose,
})

export const Item = /* @__PURE__ */ Object.assign(SelectItem, {
  Text: SelectItemText,
  Indicator: SelectItemIndicator,
  Context: SelectItemContext,
})

export const Chip = /* @__PURE__ */ Object.assign(SelectChip, { Text: SelectChipText, Trigger: SelectChipTrigger })

export const Group = /* @__PURE__ */ Object.assign(SelectGroup, { Label: SelectGroupLabel })

// Seeds' own, with no look
export const Context: typeof Seed.Context = Seed.Context
export const HiddenSelect: typeof Seed.HiddenSelect = Seed.HiddenSelect

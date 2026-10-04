import { RatingGroup as Seed } from "@foliag/seeds/rating-group"
import { RatingGroupItem } from "./rating-group-item.jsx"
import { RatingGroupItemContext } from "./rating-group-item-context.jsx"

export {
  RatingGroupControl as Control,
  type RatingGroupControlProps as ControlProps,
} from "./rating-group-control.jsx"
export type { RatingGroupItemProps as ItemProps } from "./rating-group-item.jsx"
export type { RatingGroupItemContextProps as ItemContextProps } from "./rating-group-item-context.jsx"
export { RatingGroupLabel as Label, type RatingGroupLabelProps as LabelProps } from "./rating-group-label.jsx"
export { RatingGroupRoot as Root, type RatingGroupRootProps as RootProps } from "./rating-group-root.jsx"
export {
  RatingGroupRootProvider as RootProvider,
  type RatingGroupRootProviderProps as RootProviderProps,
} from "./rating-group-root-provider.jsx"
export type ContextProps = Seed.ContextProps
export type HiddenInputProps = Seed.HiddenInputProps
export type HoverChangeDetails = Seed.HoverChangeDetails
export type ItemState = Seed.ItemState
export type ValueChangeDetails = Seed.ValueChangeDetails

export const Item = /* @__PURE__ */ Object.assign(RatingGroupItem, { Context: RatingGroupItemContext })

// Seeds' own, with no look
export const Context: typeof Seed.Context = Seed.Context
export const HiddenInput: typeof Seed.HiddenInput = Seed.HiddenInput

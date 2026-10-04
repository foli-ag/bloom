import { Pagination as Seed } from "@foliag/seeds/pagination"

export {
  PaginationEllipsis as Ellipsis,
  type PaginationEllipsisProps as EllipsisProps,
} from "./pagination-ellipsis.jsx"
export { PaginationItem as Item, type PaginationItemProps as ItemProps } from "./pagination-item.jsx"
export {
  PaginationProgressText as ProgressText,
  type PaginationProgressTextProps as ProgressTextProps,
  type PaginationProgressTextDetails as ProgressTextDetails,
} from "./pagination-progress-text.jsx"
export { PaginationRoot as Root, type PaginationRootProps as RootProps } from "./pagination-root.jsx"
export type { PaginationCompact as Compact } from "./pagination-look.js"
export {
  PaginationRootProvider as RootProvider,
  type PaginationRootProviderProps as RootProviderProps,
} from "./pagination-root-provider.jsx"
export type { PaginationTranslations as Translations } from "./use-pagination.js"
export type ContextProps = Seed.ContextProps
export type ItemLabelDetails = Seed.ItemLabelDetails
export type PageChangeDetails = Seed.PageChangeDetails
export type PageSizeChangeDetails = Seed.PageSizeChangeDetails
export type PageUrlDetails = Seed.PageUrlDetails
export type Pages = Seed.Pages

// Seeds' own, with no look. The triggers render as a `Button` with words.
export const Trigger: typeof Seed.Trigger = Seed.Trigger
export const Context: typeof Seed.Context = Seed.Context

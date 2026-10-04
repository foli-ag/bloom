import { Pagination as Seed } from "@foliag/seeds/pagination"
import { omit, untrack, type Element } from "solid-js"
import { tv } from "../internal/variants.js"
import { forwardRef } from "../internal/pointer.js"
import { keepFocus, PaginationLook, type PaginationCompact } from "./pagination-look.js"
import { translationsFrom, type PaginationTranslations } from "./use-pagination.js"

export type PaginationRootProps = Omit<Seed.RootProps, "class" | "translations"> & {
  /** The navigation's name and each page's, which no part shows. Required, as zag's are English. */
  translations: PaginationTranslations
  /**
   * Only the triggers, at the ends of the row, with `ProgressText` between them saying where the farmer is, "3 / 12":
   * for a phone, where a row of pages would wrap. `"phone"` does it below 640px only, and shows the pages from there
   * on, so one pagination with its pages and its `ProgressText` suits both. The pages and dots are hidden while compact,
   * and the position while not.
   */
  compact?: PaginationCompact | undefined
  /** Merged after the component's own classes, and wins over them */
  class?: string | undefined
}

/**
 * Pages of `pageSize` things out of `count`, such as a long list of interventions. Its items and ellipses come from
 * `pages`, read through `Pagination.Context`. Zag builds `pages` anew on every change, so key them by page number:
 * otherwise every page is a new button each time, the one the farmer chose from the keyboard loses the focus, and the
 * fill snaps from one page to the next instead of fading across. Its triggers are seeds' own, with no look: render them
 * as a `Button` with words. The row wraps on a narrow screen rather than overflow it.
 *
 * A trigger in focus that can no longer be pressed, the next one on the last page, hands the focus to the page now shown,
 * or in a compact pagination to the other trigger, where the browser would drop it to the top of the page.
 *
 * @example
 * <Pagination.Root count={120} pageSize={20} translations={{ rootLabel: "Pages", itemLabel: ({ page }) => `Page ${page}` }}>
 *   <Pagination.Trigger.Prev as={Button} tone="neutral" variant="outline">Précédente</Pagination.Trigger.Prev>
 *   <Pagination.Context>
 *     {(api) => (
 *       <For each={api().pages} keyed={(entry) => (entry.type === "page" ? entry.value : entry)}>
 *         {(entry, index) => {
 *           const page = untrack(entry)
 *           return page.type === "page" ? (
 *             <Pagination.Item {...page}>{page.value}</Pagination.Item>
 *           ) : (
 *             <Pagination.Ellipsis index={index()} />
 *           )
 *         }}
 *       </For>
 *     )}
 *   </Pagination.Context>
 *   <Pagination.Trigger.Next as={Button} tone="neutral" variant="outline">Suivante</Pagination.Trigger.Next>
 * </Pagination.Root>
 *
 * <Pagination.Root compact count={240} pageSize={20} translations={translations}>
 *   <Pagination.Trigger.Prev as={Button} tone="neutral" variant="outline">Précédente</Pagination.Trigger.Prev>
 *   <Pagination.ProgressText>{({ page, totalPages }) => `${page} / ${totalPages}`}</Pagination.ProgressText>
 *   <Pagination.Trigger.Next as={Button} tone="neutral" variant="outline">Suivante</Pagination.Trigger.Next>
 * </Pagination.Root>
 */
export function PaginationRoot(props: PaginationRootProps): Element {
  const rest = omit(props, "class", "translations", "compact")
  return (
    <PaginationLook value={() => props.compact ?? false}>
      <Seed.Root
        {...rest}
        ref={(element: HTMLElement) => {
          keepFocus(element)
          forwardRef(
            untrack(() => rest.ref),
            element,
          )
        }}
        translations={translationsFrom(props.translations)}
        class={root({ compact: compactVariant(props.compact), class: props.class })}
      />
    </PaginationLook>
  )
}

export function compactVariant(compact: PaginationCompact | undefined) {
  return compact === "phone" ? "phone" : compact ? "always" : "row"
}

// Compact, the triggers sit at the two ends of the full width, where a thumb finds them, and never wrap
export const root = tv({
  base: "flex items-center",
  variants: {
    compact: {
      row: "flex-wrap gap-1",
      always: "w-full flex-nowrap justify-between gap-3",
      phone: "flex-wrap gap-1 max-sm:w-full max-sm:flex-nowrap max-sm:justify-between max-sm:gap-3",
    },
  },
  defaultVariants: { compact: "row" },
})

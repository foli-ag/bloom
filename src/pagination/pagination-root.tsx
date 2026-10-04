import { Pagination as Seed } from "@foliag/seeds/pagination"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"
import { translationsFrom, type PaginationTranslations } from "./use-pagination.js"

export type PaginationRootProps = Omit<Seed.RootProps, "class" | "translations"> & {
  /** The navigation's name and each page's, which no part shows. Required, as zag's are English. */
  translations: PaginationTranslations
  /** Merged after the component's own classes, and wins over them */
  class?: string | undefined
}

/**
 * Pages of `pageSize` things out of `count`, such as a long list of interventions. Its items and ellipses come from
 * `pages`, read through `Pagination.Context`. Its triggers are seeds' own, with no look: render them as a `Button`
 * with words. The row wraps on a narrow screen rather than overflow it.
 *
 * @example
 * <Pagination.Root count={120} pageSize={20} translations={{ rootLabel: "Pages", itemLabel: ({ page }) => `Page ${page}` }}>
 *   <Pagination.Trigger.Prev as={Button} tone="neutral" variant="outline">Précédente</Pagination.Trigger.Prev>
 *   <Pagination.Context>
 *     {(api) => (
 *       <For each={api().pages}>
 *         {(entry, index) =>
 *           entry.type === "page" ? (
 *             <Pagination.Item {...entry}>{entry.value}</Pagination.Item>
 *           ) : (
 *             <Pagination.Ellipsis index={index()} />
 *           )
 *         }
 *       </For>
 *     )}
 *   </Pagination.Context>
 *   <Pagination.Trigger.Next as={Button} tone="neutral" variant="outline">Suivante</Pagination.Trigger.Next>
 * </Pagination.Root>
 */
export function PaginationRoot(props: PaginationRootProps): Element {
  return (
    <Seed.Root
      {...omit(props, "class", "translations")}
      translations={translationsFrom(props.translations)}
      class={root({ class: props.class })}
    />
  )
}

export const root = tv({ base: "flex flex-wrap items-center gap-1" })

import { Pagination as Seed } from "@foliag/seeds/pagination"
import { omit, type Element } from "solid-js"
import { root } from "./pagination-root.jsx"

export type PaginationRootProviderProps = Omit<Seed.RootProviderProps, "class"> & {
  class?: string | undefined
}

/** A root for a pagination made with bloom's `usePagination`, whose page the app then reads and sets from outside it */
export function PaginationRootProvider(props: PaginationRootProviderProps): Element {
  return <Seed.RootProvider {...omit(props, "class")} class={root({ class: props.class })} />
}

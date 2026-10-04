import { Pagination as Seed } from "@foliag/seeds/pagination"
import { omit, untrack, type Element } from "solid-js"
import { forwardRef } from "../internal/pointer.js"
import { keepFocus, PaginationLook, type PaginationCompact } from "./pagination-look.js"
import { compactVariant, root } from "./pagination-root.jsx"

export type PaginationRootProviderProps = Omit<Seed.RootProviderProps, "class"> & {
  /** As on `Root`: only the triggers and the position between them, always or on a phone */
  compact?: PaginationCompact | undefined
  class?: string | undefined
}

/** A root for a pagination made with bloom's `usePagination`, whose page the app then reads and sets from outside it */
export function PaginationRootProvider(props: PaginationRootProviderProps): Element {
  const rest = omit(props, "class", "compact")
  return (
    <PaginationLook value={() => props.compact ?? false}>
      <Seed.RootProvider
        {...rest}
        ref={(element: HTMLElement) => {
          keepFocus(element)
          forwardRef(
            untrack(() => rest.ref),
            element,
          )
        }}
        class={root({ compact: compactVariant(props.compact), class: props.class })}
      />
    </PaginationLook>
  )
}

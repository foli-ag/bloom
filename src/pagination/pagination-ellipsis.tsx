import { Pagination as Seed } from "@foliag/seeds/pagination"
import { omit, type Element } from "solid-js"
import { tv } from "../internal/variants.js"
import { Mark } from "../internal/icons.jsx"
import { useCompact } from "./pagination-look.js"

export type PaginationEllipsisProps = Omit<Seed.EllipsisProps, "class" | "children"> & {
  class?: string | undefined
}

/** Three dots where pages are left out, as wide as a page so the row does not jump. It is decoration, hidden while compact. */
export function PaginationEllipsis(props: PaginationEllipsisProps): Element {
  const compact = useCompact()
  return (
    <Seed.Ellipsis {...omit(props, "class")} class={ellipsis({ compact: compact(), class: props.class })}>
      <Mark class="size-5">
        <path d="M5 12h.01M12 12h.01M19 12h.01" />
      </Mark>
    </Seed.Ellipsis>
  )
}

const ellipsis = tv({
  base: "inline-flex size-12 items-center justify-center text-muted",
  variants: { compact: { row: "", always: "hidden", phone: "max-sm:hidden" } },
})

import { Pagination as Seed } from "@foliag/seeds/pagination"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"
import { Mark } from "../internal/icons.jsx"

export type PaginationEllipsisProps = Omit<Seed.EllipsisProps, "class" | "children"> & {
  class?: string | undefined
}

/** Three dots where pages are left out, as wide as a page so the row does not jump. It is decoration. */
export function PaginationEllipsis(props: PaginationEllipsisProps): Element {
  return (
    <Seed.Ellipsis {...omit(props, "class")} class={ellipsis({ class: props.class })}>
      <Mark class="size-5">
        <path d="M5 12h.01M12 12h.01M19 12h.01" />
      </Mark>
    </Seed.Ellipsis>
  )
}

const ellipsis = tv({ base: "inline-flex size-12 items-center justify-center text-muted" })

import { Pagination as Seed } from "@foliag/seeds/pagination"
import type { JSX } from "@solidjs/web"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"
import { useCompact } from "./pagination-look.js"

export type PaginationItemProps = Omit<Seed.ItemProps, "class" | "children"> & {
  /** What it shows, usually the page number. Its name is `translations.itemLabel`. */
  children: JSX.Element
  class?: string | undefined
}

/** A page, a 48px square. The page shown is filled green and marked as current. It is hidden while compact. */
export function PaginationItem(props: PaginationItemProps): Element {
  const compact = useCompact()
  return <Seed.Item {...omit(props, "class")} class={item({ compact: compact(), class: props.class })} />
}

// A phone has no hover, so a page takes its hover look while it is pressed, as fast as it shrinks, as a `Button` does
const item = tv({
  base: [
    "inline-flex size-12 pressable items-center justify-center rounded-control border-2 border-transparent",
    "text-base font-semibold tracking-body text-ink tabular-nums",
    "motion-press focus-ring",
    "hover:border-strong hover:bg-neutral-soft pressing:border-strong pressing:bg-neutral-soft",
    "data-selected:border-primary-edge data-selected:bg-primary data-selected:text-on-primary",
    "data-selected:hover:bg-primary-400 data-selected:pressing:border-primary-edge data-selected:pressing:bg-primary-300",
  ],
  variants: { compact: { row: "", always: "hidden", phone: "max-sm:hidden" } },
})

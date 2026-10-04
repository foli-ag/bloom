import { Pagination as Seed } from "@foliag/seeds/pagination"
import type { JSX } from "@solidjs/web"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"

export type PaginationItemProps = Omit<Seed.ItemProps, "class" | "children"> & {
  /** What it shows, usually the page number. Its name is `translations.itemLabel`. */
  children: JSX.Element
  class?: string | undefined
}

/** A page, a 48px square. The page shown is filled green and marked as current. */
export function PaginationItem(props: PaginationItemProps): Element {
  return <Seed.Item {...omit(props, "class")} class={item({ class: props.class })} />
}

const item = tv({
  base: [
    "inline-flex size-12 pressable items-center justify-center rounded-control border-2 border-transparent",
    "text-base font-semibold tracking-body text-ink tabular-nums",
    "motion-press focus-ring hover:border-strong hover:bg-neutral-soft",
    "data-selected:border-primary-edge data-selected:bg-primary data-selected:text-on-primary",
    "data-selected:hover:bg-primary-400",
  ],
})

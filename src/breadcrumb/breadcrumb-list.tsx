import type { JSX } from "@solidjs/web"
import type { Element } from "solid-js"
import { tv } from "../internal/variants.js"
import { useBreadcrumbContext } from "./breadcrumb-context.js"

export interface BreadcrumbListProps {
  /** An `Ellipsis` first, then the `Item`s from the top of the app down to the current page */
  children: JSX.Element
  class?: string | undefined
}

/** The ordered list of pages. On a phone, while folded, it shows only its last two items after the ellipsis. */
export function BreadcrumbList(props: BreadcrumbListProps): Element {
  const trail = useBreadcrumbContext()
  return (
    <ol
      data-scope="breadcrumb"
      data-part="list"
      data-expanded={trail.expanded() ? "" : undefined}
      class={list({ class: props.class })}
    >
      {props.children}
    </ol>
  )
}

// Folded (`trail-folded`, four items or more until the ellipsis unfolds them), every item but the last two is left
// out on a phone
const list = tv({
  base: [
    "group/trail flex min-w-0 flex-wrap items-center",
    "max-sm:trail-folded:flex-nowrap max-sm:trail-folded:[&>[data-part=item]:nth-last-child(n+3)]:hidden",
  ],
})

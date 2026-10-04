import type { JSX } from "@solidjs/web"
import { onCleanup, type Element } from "solid-js"
import { tv } from "tailwind-variants"
import { Chevron } from "../internal/icons.jsx"
import { useBreadcrumbContext } from "./breadcrumb-context.js"

export interface BreadcrumbItemProps {
  /** A `Link`, or the current page as a `Link` marked `current` */
  children: JSX.Element
  class?: string | undefined
}

/**
 * A page of the trail, after a chevron that points down the trail, except for the first. The chevron is drawn and
 * hidden from assistive technology, which hears a list of links.
 */
export function BreadcrumbItem(props: BreadcrumbItemProps): Element {
  const trail = useBreadcrumbContext()
  trail.setItems((count) => count + 1)
  onCleanup(() => trail.setItems((count) => count - 1))
  return (
    <li data-scope="breadcrumb" data-part="item" class={item({ class: props.class })}>
      <span aria-hidden="true" data-part="separator" class={separator()}>
        <Chevron class="size-5 -rotate-90 rtl:rotate-90" />
      </span>
      {props.children}
    </li>
  )
}

// An item the ellipsis brings back fades in. On first render the trail is not expanded, so nothing animates.
const item = tv({
  base: [
    "flex min-w-0 items-center",
    "transition-opacity duration-(--duration-smooth) ease-smooth group-data-expanded/trail:starting:opacity-0",
  ],
})

// Only between two items: the first one has none, and the ellipsis is followed by an item that keeps its own
const separator = tv({ base: "hidden shrink-0 px-0.5 text-muted [[data-part=item]~[data-part=item]>&]:flex" })

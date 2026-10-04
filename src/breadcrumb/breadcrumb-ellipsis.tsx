import type { JSX } from "@solidjs/web"
import { type Element } from "solid-js"
import { tv } from "tailwind-variants"
import { ellipsis, Mark } from "../internal/icons.jsx"
import { useBreadcrumbContext } from "./breadcrumb-context.js"

export interface BreadcrumbEllipsisProps {
  /** What a press does, such as "Afficher tout le chemin". It names the button, which shows three dots. */
  children: JSX.Element
  class?: string | undefined
}

/**
 * Stands in for the start of a long trail on a phone, first in the `List`: a 48px button of three dots that unfolds the
 * whole trail and hands focus to its first page. It shows only while the trail is folded, and never from 640px.
 */
export function BreadcrumbEllipsis(props: BreadcrumbEllipsisProps): Element {
  const trail = useBreadcrumbContext()
  let button: HTMLButtonElement | undefined
  const unfold = () => {
    trail.expand()
    // Once the pages are back, the first one takes focus, as the button that had it leaves
    requestAnimationFrame(() =>
      button?.closest("[data-part=list]")?.querySelector<HTMLElement>("[data-part=item] [data-part=link]")?.focus(),
    )
  }
  return (
    <li data-scope="breadcrumb" data-part="ellipsis" class={item({ class: props.class })}>
      <button ref={(element) => (button = element)} type="button" class={trigger()} onClick={unfold}>
        <Mark class="size-6">
          <path d={ellipsis} />
        </Mark>
        <span class="sr-only">{props.children}</span>
      </button>
    </li>
  )
}

const item = tv({ base: "hidden shrink-0 max-sm:group-data-folded/trail:flex" })

const trigger = tv({
  base: [
    "inline-flex size-12 pressable items-center justify-center rounded-box text-primary-text",
    "motion-press hover:bg-primary-soft pressing:bg-primary-soft focus-ring [--focus-inset:3px]",
  ],
})

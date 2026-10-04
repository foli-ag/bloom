import { useComboboxContext } from "@foliag/seeds/combobox"
import type { Element } from "solid-js"
import { indicatorChevron } from "../internal/disclosure.js"
import { Chevron } from "../internal/icons.jsx"

export interface ComboboxIndicatorProps {
  class?: string | undefined
}

/**
 * A chevron at the end of the field that turns as the list opens. It is only a sign, hidden from assistive technology:
 * the whole field opens the list.
 */
export function ComboboxIndicator(props: ComboboxIndicatorProps): Element {
  const api = useComboboxContext()
  return (
    <span
      aria-hidden="true"
      data-scope="combobox"
      data-part="indicator"
      data-state={api().open ? "open" : "closed"}
      class={indicatorChevron({
        class: ["pointer-events-none absolute end-4 top-1/2 -translate-y-1/2 text-ink", props.class],
      })}
    >
      <Chevron class="size-5" />
    </span>
  )
}

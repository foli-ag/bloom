import type { Element } from "solid-js"
import { tv } from "../internal/variants.js"
import { Chevron } from "../internal/icons.jsx"

export interface ComboboxIndicatorProps {
  class?: string | undefined
}

/**
 * A chevron at the end of the field that turns as the list opens. It is only a sign, hidden from assistive technology:
 * the whole field opens the list.
 */
export function ComboboxIndicator(props: ComboboxIndicatorProps): Element {
  return (
    <span aria-hidden="true" data-scope="combobox" data-part="indicator" class={chevron({ class: props.class })}>
      <Chevron class="size-5" />
    </span>
  )
}

// Turns as `indicatorChevron` does, reading the `data-state` zag puts on the control it sits in (`group/control`)
const chevron = tv({
  base: [
    "pointer-events-none absolute end-4 top-1/2 inline-flex shrink-0 -translate-y-1/2 text-ink",
    "transition-[rotate] ease-smooth duration-[calc(var(--duration-smooth)*var(--chevron-turn,1))]",
    "group-data-[state=open]/control:rotate-180",
    "group-data-[state=closed]/control:duration-[calc(var(--collapse-exit-duration,var(--duration-exit))*var(--chevron-turn,1))]",
  ],
})

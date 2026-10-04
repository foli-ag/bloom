import { Popover as Seed } from "@foliag/seeds/popover"
import { omit, type Element } from "solid-js"
import { indicatorChevron } from "../internal/disclosure.js"
import { Chevron } from "../internal/icons.jsx"

export type PopoverIndicatorProps = Omit<Seed.IndicatorProps<"span">, "class" | "children" | "as"> & {
  class?: string | undefined
}

/** A chevron for the trigger, after its words, that turns as the popover opens */
export function PopoverIndicator(props: PopoverIndicatorProps): Element {
  return (
    <Seed.Indicator as="span" {...omit(props, "class")} class={indicatorChevron({ class: props.class })}>
      <Chevron class="size-5" />
    </Seed.Indicator>
  )
}

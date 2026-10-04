import { Select as Seed } from "@foliag/seeds/select"
import { omit, type Element } from "solid-js"
import { indicatorChevron } from "../internal/disclosure.js"
import { Chevron } from "../internal/icons.jsx"

export type SelectIndicatorProps = Omit<Seed.IndicatorProps<"span">, "class" | "children" | "as"> & {
  class?: string | undefined
}

/** A chevron at the end of the field that turns as the list opens */
export function SelectIndicator(props: SelectIndicatorProps): Element {
  return (
    <Seed.Indicator as="span" {...omit(props, "class")} class={indicatorChevron({ class: props.class })}>
      <Chevron class="size-5" />
    </Seed.Indicator>
  )
}

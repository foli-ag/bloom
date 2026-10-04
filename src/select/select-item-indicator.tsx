import { Select as Seed } from "@foliag/seeds/select"
import { omit, type Element } from "solid-js"
import { Mark, tick } from "../internal/icons.jsx"
import { optionIndicator } from "../internal/overlay.js"

export type SelectItemIndicatorProps = Omit<Seed.ItemIndicatorProps, "class" | "children"> & {
  class?: string | undefined
}

/** A tick at the end of a chosen row, which pops in as it is chosen */
export function SelectItemIndicator(props: SelectItemIndicatorProps): Element {
  return (
    <Seed.Item.Indicator {...omit(props, "class")} class={optionIndicator({ class: props.class })}>
      <Mark class="size-6 animate-pop-in">
        <path d={tick} />
      </Mark>
    </Seed.Item.Indicator>
  )
}

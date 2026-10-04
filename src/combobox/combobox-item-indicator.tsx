import { Combobox as Seed } from "@foliag/seeds/combobox"
import { omit, type Element } from "solid-js"
import { Mark, tick } from "../internal/icons.jsx"
import { optionIndicator } from "../internal/overlay.js"

export type ComboboxItemIndicatorProps = Omit<Seed.ItemIndicatorProps, "class" | "children"> & {
  class?: string | undefined
}

/** A tick at the end of a chosen row, which pops in as it is chosen */
export function ComboboxItemIndicator(props: ComboboxItemIndicatorProps): Element {
  return (
    <Seed.Item.Indicator hidden={false} {...omit(props, "class")} class={optionIndicator({ class: props.class })}>
      <Mark class="size-6">
        <path d={tick} />
      </Mark>
    </Seed.Item.Indicator>
  )
}

import { Combobox as Seed } from "@foliag/seeds/combobox"
import { omit, type Element } from "solid-js"
import { option } from "../internal/overlay.js"

export type ComboboxItemProps = Omit<Seed.ItemProps, "class"> & {
  class?: string | undefined
}

/** A row of the list, at least 48px tall, holding an `Item.Text` and an `Item.Indicator` */
export function ComboboxItem(props: ComboboxItemProps): Element {
  return <Seed.Item {...omit(props, "class")} class={option({ class: props.class })} />
}

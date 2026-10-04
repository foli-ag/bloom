import { Select as Seed } from "@foliag/seeds/select"
import { omit, type Element } from "solid-js"
import { option } from "../internal/overlay.js"

export type SelectItemProps = Omit<Seed.ItemProps, "class"> & {
  class?: string | undefined
}

/** A row of the list, at least 48px tall, holding an `Item.Text` and an `Item.Indicator` */
export function SelectItem(props: SelectItemProps): Element {
  return <Seed.Item {...omit(props, "class")} class={option({ class: props.class })} />
}

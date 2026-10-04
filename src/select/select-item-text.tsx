import { Select as Seed } from "@foliag/seeds/select"
import type { JSX } from "@solidjs/web"
import { omit, type Element } from "solid-js"
import { optionText } from "../internal/overlay.js"

export type SelectItemTextProps = Omit<Seed.ItemTextProps, "class" | "children"> & {
  /** The item's words, usually its label */
  children: JSX.Element
  class?: string | undefined
}

export function SelectItemText(props: SelectItemTextProps): Element {
  return <Seed.Item.Text {...omit(props, "class")} class={optionText({ class: props.class })} />
}

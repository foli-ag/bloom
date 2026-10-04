import { Combobox as Seed } from "@foliag/seeds/combobox"
import type { JSX } from "@solidjs/web"
import { omit, type Element } from "solid-js"
import { optionText } from "../internal/overlay.js"

export type ComboboxItemTextProps = Omit<Seed.ItemTextProps, "class" | "children"> & {
  /** The item's words, usually its label */
  children: JSX.Element
  class?: string | undefined
}

export function ComboboxItemText(props: ComboboxItemTextProps): Element {
  return <Seed.Item.Text {...omit(props, "class")} class={optionText({ class: props.class })} />
}

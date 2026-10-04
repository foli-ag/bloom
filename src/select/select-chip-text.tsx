import type { JSX } from "@solidjs/web"
import type { Element } from "solid-js"
import { ChipText } from "../internal/chips.jsx"

export interface SelectChipTextProps {
  /** The item's label, cut short with an ellipsis if it does not fit the field */
  children: JSX.Element
  class?: string | undefined
}

export function SelectChipText(props: SelectChipTextProps): Element {
  return (
    <ChipText scope="select" class={props.class}>
      {props.children}
    </ChipText>
  )
}

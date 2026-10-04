import type { JSX } from "@solidjs/web"
import type { Element } from "solid-js"
import { ChipTrigger } from "../internal/chips.jsx"

export interface SelectChipTriggerProps {
  /** What a press does, such as "Retirer Blé tendre". It names the button, which shows a cross. */
  children: JSX.Element
  class?: string | undefined
}

/**
 * The chip's cross, which takes its choice out. A 48px target, out of the Tab order, as the list already takes a
 * choice out from the keyboard; a screen reader still finds it, by its words.
 */
export function SelectChipTrigger(props: SelectChipTriggerProps): Element {
  return (
    <ChipTrigger scope="select" class={props.class}>
      {props.children}
    </ChipTrigger>
  )
}

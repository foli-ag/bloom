import type { JSX } from "@solidjs/web"
import type { Element } from "solid-js"
import { ChipTrigger } from "../internal/chips.jsx"

export interface ComboboxChipTriggerProps {
  /** What a press does, such as "Retirer Auch". It names the button, which shows a cross. */
  children: JSX.Element
  class?: string | undefined
}

/**
 * The chip's cross, which takes its choice out. A 48px target, out of the Tab order, as Backspace and the list take a
 * choice out from the keyboard; a screen reader still finds it, by its words.
 */
export function ComboboxChipTrigger(props: ComboboxChipTriggerProps): Element {
  return (
    <ChipTrigger scope="combobox" class={props.class}>
      {props.children}
    </ChipTrigger>
  )
}

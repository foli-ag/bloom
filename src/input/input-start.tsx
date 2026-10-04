import type { JSX } from "@solidjs/web"
import type { Element } from "solid-js"
import { inputPart } from "./input-part.js"

export interface InputStartProps {
  /** A mark, such as a magnifier, a short text or a button */
  children: JSX.Element
  /** Merged after the part's own classes, and wins over them */
  class?: string | undefined
}

/**
 * What sits in the field's box before the text, on the left, or on the right in a right-to-left page: a mark that says
 * what the field is for, or a button. It goes first wherever it is written among the `Input`'s children.
 *
 * @example
 * <Input aria-label="Rechercher une parcelle" type="search">
 *   <Input.Start><SearchMark /></Input.Start>
 * </Input>
 */
export function InputStart(props: InputStartProps): Element {
  return (
    <span data-part="start" class={inputPart({ side: "start", class: props.class })}>
      {props.children}
    </span>
  )
}

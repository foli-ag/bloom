import type { JSX } from "@solidjs/web"
import type { Element } from "solid-js"
import { inputPart } from "./input-part.js"

export interface InputEndProps {
  /** A unit, such as "ha", a short text, a mark or a button */
  children: JSX.Element
  /** Merged after the part's own classes, and wins over them */
  class?: string | undefined
}

/**
 * What sits in the field's box after the text, on the right, or on the left in a right-to-left page: the unit of a
 * number, or a button such as one that empties the field. It goes last wherever it is written among the `Input`'s
 * children.
 *
 * @example
 * <Input id="surface" name="surface" inputmode="decimal">
 *   <Input.End>ha</Input.End>
 * </Input>
 */
export function InputEnd(props: InputEndProps): Element {
  return (
    <span data-part="end" class={inputPart({ side: "end", class: props.class })}>
      {props.children}
    </span>
  )
}

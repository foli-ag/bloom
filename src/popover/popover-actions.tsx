import type { JSX } from "@solidjs/web"
import type { Element } from "solid-js"
import { actions } from "../internal/overlay.js"

export interface PopoverActionsProps {
  /** The buttons, its `Trigger.Close` among them */
  children: JSX.Element
  class?: string | undefined
}

/** The popover's buttons, a part seeds does not have: stacked at full width on a phone, in a row at the end from 640px */
export function PopoverActions(props: PopoverActionsProps): Element {
  return <div class={actions({ class: props.class })}>{props.children}</div>
}

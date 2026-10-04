import type { JSX } from "@solidjs/web"
import type { Element } from "solid-js"
import { actions } from "../internal/overlay.js"

export interface DialogActionsProps {
  /** The buttons, the one that backs out first: the main one then ends up last */
  children: JSX.Element
  class?: string | undefined
}

/**
 * The dialog's buttons, a part seeds does not have. On a phone they stack at full width, the main one at the bottom
 * where the thumb rests. From 640px they sit in a row at the end, the main one last.
 */
export function DialogActions(props: DialogActionsProps): Element {
  return <div class={actions({ class: props.class })}>{props.children}</div>
}

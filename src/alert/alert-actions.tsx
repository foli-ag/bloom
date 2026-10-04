import type { JSX } from "@solidjs/web"
import type { Element } from "solid-js"
import { tv } from "tailwind-variants"

export interface AlertActionsProps {
  /** Buttons that act on the news, such as "Réessayer" */
  children: JSX.Element
  class?: string | undefined
}

/** Buttons under the words, at the start, wrapping on a narrow screen */
export function AlertActions(props: AlertActionsProps): Element {
  return (
    <div data-scope="alert" data-part="actions" class={actions({ class: props.class })}>
      {props.children}
    </div>
  )
}

const actions = tv({ base: "mt-2 flex flex-wrap items-center gap-3" })

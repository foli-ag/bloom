import type { JSX } from "@solidjs/web"
import type { Element } from "solid-js"
import { tv } from "../internal/variants.js"

export interface CardActionsProps {
  /** The buttons, the main one last */
  children: JSX.Element
  class?: string | undefined
}

/**
 * The card's buttons, at its foot. They share the row and grow to fill it on a phone, wrapping to a line each when
 * their words do not fit, and from 640px they sit at the end at their own width, the main one last. Not for a card that
 * is itself a link or a button, which cannot hold another control.
 */
export function CardActions(props: CardActionsProps): Element {
  return (
    <div data-scope="card" data-part="actions" class={actions({ class: props.class })}>
      {props.children}
    </div>
  )
}

const actions = tv({ base: "flex flex-wrap items-center justify-end gap-3 max-sm:*:grow" })

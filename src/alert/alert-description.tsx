import type { JSX } from "@solidjs/web"
import type { Element } from "solid-js"
import { tv } from "../internal/variants.js"

export interface AlertDescriptionProps {
  /** What it means and what to do, such as "Vos saisies sont gardées sur le téléphone." */
  children: JSX.Element
  class?: string | undefined
}

export function AlertDescription(props: AlertDescriptionProps): Element {
  return (
    <div data-scope="alert" data-part="description" class={description({ class: props.class })}>
      {props.children}
    </div>
  )
}

const description = tv({ base: "text-base text-ink" })

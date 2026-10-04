import type { Element } from "solid-js"
import { tv } from "tailwind-variants"
import { StatusMark } from "../internal/icons.jsx"
import { useAlertContext } from "./alert-context.js"

export interface AlertIndicatorProps {
  class?: string | undefined
}

/**
 * The mark of the alert's tone, before its words: an "i" for information, a tick for success, a "!" in a triangle for
 * a warning and in an octagon for danger. It is decoration, as the words say it.
 */
export function AlertIndicator(props: AlertIndicatorProps): Element {
  const alert = useAlertContext()
  return (
    <span data-scope="alert" data-part="indicator" class={indicator({ class: props.class })}>
      <StatusMark tone={alert.tone()} class="size-6" />
    </span>
  )
}

// As tall as a line of the title, so the mark sits on its first line
const indicator = tv({ base: "flex h-7 items-center text-(--alert-ink)" })

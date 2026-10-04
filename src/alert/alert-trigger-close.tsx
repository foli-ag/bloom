import { Polymorphic, type PolymorphicProps, type ValidComponent } from "@foliag/seeds/polymorphic"
import type { JSX } from "@solidjs/web"
import { omit, type Element } from "solid-js"
import { useAlertContext } from "./alert-context.js"

export type AlertTriggerCloseProps<As extends ValidComponent = "button"> = PolymorphicProps<
  As,
  {
    /** Its words, such as "Fermer" */
    children: JSX.Element
  }
>

/**
 * Dismisses the alert, which folds away. Put directly in the `Root`, it sits at the end of the first line; inside
 * `Actions`, among the buttons. It has no look: render it as a quiet `Button`.
 */
export function AlertTriggerClose<As extends ValidComponent = "button">(props: AlertTriggerCloseProps<As>): Element {
  const alert = useAlertContext()
  const rest = omit(props as AlertTriggerCloseProps, "onClick")
  return (
    <Polymorphic
      as="button"
      type={props.as === undefined ? "button" : undefined}
      {...(rest as object)}
      data-scope="alert"
      data-part="close-trigger"
      onClick={(event: MouseEvent & { currentTarget: HTMLElement; target: globalThis.Element }) => {
        const own = (props as { onClick?: unknown }).onClick
        if (typeof own === "function") own(event)
        if (!event.defaultPrevented) alert.close()
      }}
    />
  )
}

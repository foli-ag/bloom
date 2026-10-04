import { Polymorphic, type PolymorphicProps, type ValidComponent } from "@foliag/seeds/polymorphic"
import type { JSX } from "@solidjs/web"
import { omit, type Element } from "solid-js"
import { tv } from "../internal/variants.js"

export type AlertTitleProps<As extends ValidComponent = "p"> = PolymorphicProps<
  As,
  {
    /** What happened, in a few words, such as "Enregistrement impossible" */
    children: JSX.Element
    class?: string | undefined
  }
>

/** The alert's first words, in its tone's color. A paragraph, or the heading the page needs through `as`. */
export function AlertTitle<As extends ValidComponent = "p">(props: AlertTitleProps<As>): Element {
  const rest = omit(props, "class")
  return <Polymorphic as="p" {...rest} data-scope="alert" data-part="title" class={title({ class: props.class })} />
}

const title = tv({ base: "text-base font-semibold tracking-body text-(--alert-ink)" })

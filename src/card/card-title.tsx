import { Polymorphic, type PolymorphicProps, type ValidComponent } from "@foliag/seeds/polymorphic"
import type { JSX } from "@solidjs/web"
import { omit, onCleanup, type Element } from "solid-js"
import { tv } from "../internal/variants.js"
import { useCardContext } from "./card-context.js"

export type CardTitleProps<As extends ValidComponent = "h3"> = PolymorphicProps<
  As,
  {
    /** What the card is about. It names a card that is a link or a button. */
    children: JSX.Element
    class?: string | undefined
  }
>

/**
 * The card's title, an `h3` unless `as` says which level the page needs, and a span in a card that is a button, where
 * a heading is not allowed.
 */
export function CardTitle<As extends ValidComponent = "h3">(props: CardTitleProps<As>): Element {
  const card = useCardContext()
  // Fixed for the card's life, so the element is never rebuilt
  const tag = card?.phrasing ? "span" : "h3"
  const id = card?.titleId
  // A view made once: spread straight from `omit(…)`, the compiler would wrap it in a memo that Polymorphic reads untracked
  const rest = omit(props, "class")
  card?.setTitled(true)
  onCleanup(() => card?.setTitled(false))
  return (
    <Polymorphic as={tag} id={id} {...rest} data-scope="card" data-part="title" class={title({ class: props.class })} />
  )
}

const title = tv({ base: "block text-lg font-semibold tracking-heading text-ink" })

import { Polymorphic, type PolymorphicProps, type ValidComponent } from "@foliag/seeds/polymorphic"
import type { JSX } from "@solidjs/web"
import { omit, onCleanup, type Element } from "solid-js"
import { tv } from "tailwind-variants"
import { useCardContext } from "./card-context.js"

export type CardDescriptionProps<As extends ValidComponent = "p"> = PolymorphicProps<
  As,
  {
    /** A line under the title, such as "Blé tendre, 12,4 ha". It describes a card that is a link or a button. */
    children: JSX.Element
    class?: string | undefined
  }
>

export function CardDescription<As extends ValidComponent = "p">(props: CardDescriptionProps<As>): Element {
  const card = useCardContext()
  // Fixed for the card's life, so the element is never rebuilt
  const tag = card?.phrasing ? "span" : "p"
  const id = card?.descriptionId
  // A view made once: spread straight from `omit(…)`, the compiler would wrap it in a memo that Polymorphic reads untracked
  const rest = omit(props, "class")
  card?.setDescribed(true)
  onCleanup(() => card?.setDescribed(false))
  return (
    <Polymorphic
      as={tag}
      id={id}
      {...rest}
      data-scope="card"
      data-part="description"
      class={description({ class: props.class })}
    />
  )
}

const description = tv({ base: "block text-base text-muted" })

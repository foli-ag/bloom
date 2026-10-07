import { Polymorphic, type PolymorphicProps, type ValidComponent } from "@foliag/seeds/polymorphic"
import type { JSX } from "@solidjs/web"
import { createSignal, createUniqueId, omit, onSettled, untrack, type Element } from "solid-js"
import { tv, type VariantProps } from "../internal/variants.js"
import { forwardRef } from "../internal/pointer.js"
import { createPresence } from "../internal/presence.js"
import { cardSurface } from "../internal/surface.js"
import { CardContext } from "./card-context.js"

export type CardRootProps<As extends ValidComponent = "div"> = PolymorphicProps<As, CardRootOwnProps>

interface CardRootOwnProps extends VariantProps<typeof root> {
  children: JSX.Element
  /** Merged after the component's own classes, and wins over them */
  class?: string | undefined
}

/**
 * A surface that holds one thing: a field, a delivery, a person. `outline`, the default, is an edge on the raised
 * surface and suits a list of cards. `elevated` stands off the page with a shadow, for the one card a screen is about.
 * `soft` is a tint with no edge, for a group of details inside a page or inside another card.
 *
 * Rendered as a link or a button (`as="a"`, `as={A}` from a router, `as="button"`), the whole card is one target: its
 * edge turns strong, it goes down a little under the finger, and the keyboard's ring is drawn inside its edge. It is
 * named by its `Title` and described by its `Description`, so a screen reader says "Les Grands Champs, lien" and not
 * every word in it. Such a card holds no other control, as a link or a button cannot hold one. A card rendered as a
 * button holds phrasing content only, so its parts render as spans.
 *
 * Spacing, for card-like parts elsewhere to match: 20px inside the 2px edge (`p-5`), parts 16px apart (`gap-4`), a
 * title and its description 4px apart (`gap-1`), buttons 12px apart (`gap-3`), on the corners of `cardSurface`.
 *
 * @example
 * <Card.Root>
 *   <Card.Header>
 *     <Card.Title>Les Grands Champs</Card.Title>
 *     <Card.Description>Blé tendre, 12,4 ha</Card.Description>
 *     <Badge tone="success" indicator="mark">Semé</Badge>
 *   </Card.Header>
 *   <Card.Body>Semé le 12 octobre, levée régulière.</Card.Body>
 *   <Card.Actions>
 *     <Button tone="neutral" variant="outline">Modifier</Button>
 *   </Card.Actions>
 * </Card.Root>
 *
 * <Card.Root as="a" href="/parcelles/12">…</Card.Root>
 */
export function CardRoot<As extends ValidComponent = "div">(props: CardRootProps<As>): Element {
  const rest = omit(props, "variant", "class", "children")
  // The parts say they are there as they mount
  const [titled, setTitled] = createPresence()
  const [described, setDescribed] = createPresence()
  const [target, setTarget] = createSignal(false, { ownedWrite: true })
  const titleId = createUniqueId()
  const descriptionId = createUniqueId()
  let element: HTMLElement | undefined
  // Read once the element has its attributes, as `href` lands after the ref is called
  onSettled(() => {
    setTarget(element?.matches("a[href], button") ?? false)
  })
  const own = props as { "aria-labelledby"?: string; "aria-describedby"?: string }
  return (
    <CardContext
      value={{ phrasing: untrack(() => props.as === "button"), titleId, descriptionId, setTitled, setDescribed }}
    >
      <Polymorphic
        as="div"
        // A button in a form submits it, so an app opts in with type="submit"
        type={props.as === "button" ? "button" : undefined}
        {...rest}
        data-scope="card"
        data-part="root"
        aria-labelledby={own["aria-labelledby"] ?? (target() && titled() ? titleId : undefined)}
        aria-describedby={own["aria-describedby"] ?? (target() && described() ? descriptionId : undefined)}
        ref={(node: HTMLElement) => {
          element = node
          forwardRef(
            untrack(() => rest.ref),
            node,
          )
        }}
        class={root({ variant: props.variant, class: props.class })}
      >
        {props.children}
      </Polymorphic>
    </CardContext>
  )
}

/**
 * A card that is a link or a button answers the finger as a button does, by half as much, as a whole card shrinking by
 * a button's 3% would lurch. Its colors reach the pressed look with the press, as a phone has no hover. An elevated
 * one lifts under the pointer: a second shadow drawn by `::after` fades in, which the compositor runs, and an outer
 * shadow is only painted outside the card, so it never covers what is in it.
 */
const root = tv({
  base: [
    "relative flex min-w-0 flex-col gap-4 p-5 text-start text-base font-medium tracking-body",
    "[&:is(a[href],button)]:pressable [&:is(a[href],button)]:motion-press [&:is(a[href],button)]:focus-ring",
    "[&:is(a[href],button)]:pressing:scale-[calc(1-(1-var(--press-scale))/2)]",
    "[&:is(a[href],button)]:hover:border-ink [&:is(a[href],button)]:pressing:border-ink",
    "disabled:cursor-not-allowed disabled:hover:border-strong",
  ],
  variants: {
    variant: {
      outline: [cardSurface({ edge: "quiet" }), "[&:is(a[href],button)]:border-strong"],
      elevated: [
        cardSurface({ edge: "quiet" }),
        "shadow-(--shadow-card) [&:is(a[href],button)]:border-strong",
        "after:pointer-events-none after:absolute after:-inset-0.5 after:rounded-[inherit] after:opacity-0",
        "after:shadow-(--shadow-card-lift) after:transition-opacity after:duration-(--duration-smooth) after:ease-smooth",
        "[&:is(a[href],button)]:hover:after:opacity-100 disabled:hover:after:opacity-0",
      ],
      soft: [
        "rounded-card border-2 border-transparent bg-neutral-soft text-ink",
        // Muted text on the tint falls just short of 7:1, so it leans a little toward the ink
        "[&_[data-part=description]]:text-[color-mix(in_oklab,var(--color-muted),var(--color-ink)_30%)]",
        "[&:is(a[href],button)]:hover:border-strong [&:is(a[href],button)]:pressing:border-strong",
      ],
    },
  },
  defaultVariants: { variant: "outline" },
})

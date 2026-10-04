import { Collapsible as Seed } from "@foliag/seeds/collapsible"
import type { JSX } from "@solidjs/web"
import { createContext, omit, Show, useContext, type Element } from "solid-js"
import { tv } from "../internal/variants.js"
import { disclosureContent, triggerChevron } from "../internal/disclosure.js"
import { Chevron } from "../internal/icons.jsx"
import { cardSurface } from "../internal/surface.js"

type Variant = "plain" | "card"

// The variant of the `Root` around a part. A context and not a selector, so a collapsible inside another one's content
// keeps its own look.
const VariantContext = /* @__PURE__ */ createContext<() => Variant>(() => "plain")

export type RootProps = Omit<Seed.RootProps, "class"> & {
  /**
   * `plain`, the default: a quiet button in the flow of the page, and what it shows under it. `card`: the whole
   * collapsible drawn as a card, its first row the button, with a title, a `Description` under it if there is one,
   * and the chevron at the end, and what it shows in the card's body.
   */
  variant?: Variant | undefined
  /** Merged after the component's own classes, and wins over them */
  class?: string | undefined
}

/**
 * Something shown or hidden by one button, such as the details of a field. For several in a stack where one opens as
 * another closes, use an Accordion.
 *
 * `variant` is on the root and its parts read it, so the same three parts make either look and an app changes one
 * prop to go from one to the other, as a `Button` does. Parts of their own for the card would be names seeds does not
 * have, for the same button and the same content.
 *
 * @example
 * <Collapsible.Root>
 *   <Collapsible.Trigger>Détails de la parcelle</Collapsible.Trigger>
 *   <Collapsible.Content>Sol limoneux, drainé en 2021.</Collapsible.Content>
 * </Collapsible.Root>
 *
 * <Collapsible.Root variant="card">
 *   <Collapsible.Trigger>
 *     Les Grands Champs
 *     <Collapsible.Description>Blé tendre, 12,4 ha</Collapsible.Description>
 *   </Collapsible.Trigger>
 *   <Collapsible.Content>Sol limoneux, drainé en 2021.</Collapsible.Content>
 * </Collapsible.Root>
 */
export function Root(props: RootProps): Element {
  const variant = () => props.variant ?? "plain"
  return (
    <VariantContext value={variant}>
      <Seed.Root {...omit(props, "class", "variant")} class={root({ variant: variant(), class: props.class })} />
    </VariantContext>
  )
}

export type TriggerProps = Omit<Seed.TriggerProps, "class" | "children"> & {
  /** The button's words, such as "Voir les détails", and in a card its `Description`. Its chevron turns when it opens. */
  children: JSX.Element
  class?: string | undefined
}

export function Trigger(props: TriggerProps): Element {
  const variant = useContext(VariantContext)
  return (
    <Seed.Trigger {...omit(props, "class", "children")} class={trigger({ variant: variant(), class: props.class })}>
      <Show when={variant() === "card"} fallback={props.children}>
        <span class={heading()}>{props.children}</span>
      </Show>
      <Chevron class={triggerChevron({ class: variant() === "card" ? "ms-auto" : undefined })} />
    </Seed.Trigger>
  )
}

export type DescriptionProps = {
  /** A line under the title of a card, such as "Blé tendre, 12,4 ha" */
  children: JSX.Element
  class?: string | undefined
}

/**
 * A line under the title, inside the `Trigger` of a card. It is part of the button, so a screen reader reads it with
 * the title, and a tap on it opens the card too.
 */
export function Description(props: DescriptionProps): Element {
  return (
    <span data-scope="collapsible" data-part="description" class={description({ class: props.class })}>
      {props.children}
    </span>
  )
}

export type ContentProps = Omit<Seed.ContentProps, "class"> & {
  class?: string | undefined
}

/**
 * Grows to its height and fades in as it opens, and folds back the same way. Under reduced motion it only fades. Its
 * children sit in a box of its own, which is what folds, so padding and layout go on an element of yours inside it. In
 * a card, that box is the card's body, 20px in from its edges as a `Card`'s.
 */
export function Content(props: ContentProps): Element {
  const variant = useContext(VariantContext)
  return (
    <Seed.Content {...omit(props, "class", "children")} class={disclosureContent({ class: props.class })}>
      <div>
        <Show when={variant() === "card"} fallback={props.children}>
          <div class={body()}>{props.children}</div>
        </Show>
      </div>
    </Seed.Content>
  )
}

// A card clips its rows to its corners, so the tint of the button follows them
const root = tv({
  variants: {
    variant: {
      plain: "",
      card: [cardSurface(), "overflow-clip"],
    },
  },
})

const trigger = tv({
  base: "group/trigger pressable focus-ring",
  variants: {
    variant: {
      // A quiet button: it goes down under the finger as a `Button` does, and its ring appears at once
      plain: [
        "-mx-3 inline-flex min-h-12 items-center gap-2 rounded-control px-3 py-2",
        "text-base font-semibold tracking-body text-primary-text",
        "motion-press hover:bg-primary-soft",
        "disabled:cursor-not-allowed disabled:text-disabled-ink disabled:hover:bg-transparent",
      ],
      // The first row of the card, the card's width: the spacing of a `Card`, 16px above and below a title as tall as
      // its line. Tinted under the pointer, at once under the finger, and it does not shrink, being the card's width.
      // The ring is drawn inside the row, along the card's edge, and appears at once.
      card: [
        "flex min-h-14 w-full items-center gap-3 px-5 py-4 text-start",
        "transition-[color,background-color] duration-[var(--press-duration,var(--duration-smooth))]",
        "ease-[var(--press-ease,var(--ease-smooth))]",
        "hover:bg-neutral-soft active:bg-[color-mix(in_oklab,var(--color-neutral-soft),var(--color-ink)_8%)]",
        "rounded-[calc(var(--radius-card)-2px)] data-[state=open]:rounded-b-none",
        "disabled:cursor-not-allowed disabled:text-disabled-ink disabled:hover:bg-transparent disabled:active:bg-transparent",
      ],
    },
  },
})

// The title and its description, 4px apart, as in a `Card`'s header
const heading = tv({
  base: "flex min-w-0 flex-col gap-1 text-lg font-semibold tracking-heading text-ink in-disabled:text-disabled-ink",
})

const description = tv({ base: "block text-base font-medium tracking-body text-muted in-disabled:text-disabled-ink" })

// 16px under the row, and 20px in from the card's edges, as a `Card`'s parts
const body = tv({ base: "px-5 pb-5 text-base text-ink" })

import { Accordion as Seed } from "@foliag/seeds/accordion"
import type { JSX } from "@solidjs/web"
import { createContext, omit, useContext, type Element } from "solid-js"
import { tv } from "tailwind-variants"
import { disclosureContent, triggerChevron } from "../internal/disclosure.js"
import { Chevron } from "../internal/icons.jsx"
import { cardSurface } from "../internal/surface.js"

type Variant = "contained" | "separated" | "flush"

// The variant of the `Root` around a part. A context and not a selector, so an accordion inside another one's section
// keeps its own look.
const VariantContext = /* @__PURE__ */ createContext<() => Variant>(() => "contained")

export type RootProps = Omit<Seed.RootProps, "class"> & {
  /**
   * `contained`, the default: the sections in one card, with a line between them. `separated`: each section a card
   * of its own, 12px apart. `flush`: no card, only the lines between sections, for an accordion inside a card or a
   * panel, whose titles and text line up with what is around them.
   */
  variant?: Variant | undefined
  /** Merged after the component's own classes, and wins over them */
  class?: string | undefined
}

/**
 * A stack of sections where each title opens its text, such as questions and answers. One is open at a time, or
 * several with `multiple`. Arrow keys, Home and End move between the titles.
 *
 * For a heading structure that a screen reader can jump through, wrap each `Item.Trigger` in the heading level the
 * page needs.
 *
 * @example
 * <Accordion.Root collapsible>
 *   <Accordion.Item value="semis">
 *     <Accordion.Item.Trigger>Quand semer ?</Accordion.Item.Trigger>
 *     <Accordion.Item.Content>Dès que le sol dépasse 8 °C.</Accordion.Item.Content>
 *   </Accordion.Item>
 * </Accordion.Root>
 */
export function Root(props: RootProps): Element {
  const variant = () => props.variant ?? "contained"
  return (
    <VariantContext value={variant}>
      <Seed.Root {...omit(props, "class", "variant")} class={root({ variant: variant(), class: props.class })} />
    </VariantContext>
  )
}

export type ItemProps = Omit<Seed.ItemProps, "class"> & {
  class?: string | undefined
}

function ItemRoot(props: ItemProps): Element {
  const variant = useContext(VariantContext)
  return <Seed.Item {...omit(props, "class")} class={item({ variant: variant(), class: props.class })} />
}

export type ItemTriggerProps = Omit<Seed.ItemTriggerProps, "class" | "children"> & {
  /** The section's title. Its chevron turns when it opens. */
  children: JSX.Element
  class?: string | undefined
}

function ItemTrigger(props: ItemTriggerProps): Element {
  const variant = useContext(VariantContext)
  return (
    <Seed.Item.Trigger
      {...omit(props, "class", "children")}
      class={trigger({ variant: variant(), class: props.class })}
    >
      <span>{props.children}</span>
      <Chevron class={triggerChevron()} />
    </Seed.Item.Trigger>
  )
}

export type ItemContentProps = Omit<Seed.ItemContentProps, "class"> & {
  class?: string | undefined
}

/** The text of a section. It folds open to its height, and under reduced motion it only fades. */
function ItemContent(props: ItemContentProps): Element {
  const variant = useContext(VariantContext)
  return (
    <Seed.Item.Content {...omit(props, "class", "children")} class={disclosureContent({ class: props.class })}>
      {/* What folds, which clips while it moves, around the padding. What the app puts inside keeps its own timing. */}
      <div>
        <div class={body({ variant: variant() })}>{props.children}</div>
      </div>
    </Seed.Item.Content>
  )
}

export const Item = Object.assign(ItemRoot, { Trigger: ItemTrigger, Content: ItemContent })

// A section closes as the next one opens, so it folds on the opening's time, and the sections below hold still. A card
// clips its rows to its corners, so the tint of a title follows them.
const root = tv({
  base: "[--collapse-exit-duration:var(--duration-smooth)]",
  variants: {
    variant: {
      contained: [cardSurface(), "overflow-clip"],
      separated: "grid gap-3",
      flush: "",
    },
  },
})

const item = tv({
  variants: {
    variant: {
      contained: "border-b-2 border-border last:border-b-0",
      separated: [cardSurface(), "overflow-clip"],
      flush: "border-b-2 border-border last:border-b-0",
    },
  },
})

// The ring is drawn inside the title, because a card clips anything outside its rounded edge, and appears at once.
// The title is tinted under the pointer, and at once under the finger.
const trigger = tv({
  base: [
    "group/trigger flex min-h-14 w-full pressable items-center justify-between gap-3 text-start",
    "text-base font-semibold tracking-body text-ink",
    "transition-[color,background-color] duration-[var(--press-duration,var(--duration-smooth))]",
    "ease-[var(--press-ease,var(--ease-smooth))]",
    "hover:bg-neutral-soft active:bg-[color-mix(in_oklab,var(--color-neutral-soft),var(--color-ink)_8%)]",
    "focus-ring [--focus-inset:3px]",
    "disabled:cursor-not-allowed disabled:text-disabled-ink disabled:hover:bg-transparent disabled:active:bg-transparent",
  ],
  variants: {
    variant: {
      contained: "px-4 py-3",
      // A card's spacing, 20px in from its edge, and corners that follow the card's, square at the foot while open
      separated: "rounded-[calc(var(--radius-card)-2px)] px-5 py-4 data-[state=open]:rounded-b-none",
      // Its words line up with the text around the accordion, and its tint reaches 12px past them, into the padding of
      // the card or panel it sits in
      flush: "-mx-3 w-[calc(100%+1.5rem)] rounded-control px-3 py-3",
    },
  },
})

// The text of a section, under its title and lined up with it. What the app puts inside keeps its own timing.
const body = tv({
  base: "[--collapse-exit-duration:initial]",
  variants: {
    variant: {
      contained: "px-4 pb-4",
      separated: "px-5 pb-5",
      flush: "pb-4",
    },
  },
})

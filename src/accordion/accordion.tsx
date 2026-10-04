import { Accordion as Seed } from "@foliag/seeds/accordion"
import type { JSX } from "@solidjs/web"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"
import { disclosureContent, triggerChevron } from "../internal/disclosure.js"
import { Chevron } from "../internal/icons.jsx"

export type RootProps = Omit<Seed.RootProps, "class"> & {
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
  return <Seed.Root {...omit(props, "class")} class={root({ class: props.class })} />
}

export type ItemProps = Omit<Seed.ItemProps, "class"> & {
  class?: string | undefined
}

function ItemRoot(props: ItemProps): Element {
  return <Seed.Item {...omit(props, "class")} class={item({ class: props.class })} />
}

export type ItemTriggerProps = Omit<Seed.ItemTriggerProps, "class" | "children"> & {
  /** The section's title. Its chevron turns when it opens. */
  children: JSX.Element
  class?: string | undefined
}

function ItemTrigger(props: ItemTriggerProps): Element {
  return (
    <Seed.Item.Trigger {...omit(props, "class", "children")} class={trigger({ class: props.class })}>
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
  return (
    <Seed.Item.Content {...omit(props, "class", "children")} class={disclosureContent({ class: props.class })}>
      <div class="px-4 pb-4">{props.children}</div>
    </Seed.Item.Content>
  )
}

export const Item = Object.assign(ItemRoot, { Trigger: ItemTrigger, Content: ItemContent })

const root = tv({
  base: "overflow-hidden rounded-card border-2 border-strong bg-raised",
})

const item = tv({ base: "border-b-2 border-border last:border-b-0" })

// The ring is drawn inside the title, because the stack clips anything outside its rounded edge
const trigger = tv({
  base: [
    "group/trigger flex min-h-14 w-full pressable items-center justify-between gap-3 px-4 py-3 text-start",
    "text-base font-semibold tracking-body text-ink",
    "transition-colors duration-(--duration-smooth) ease-smooth hover:bg-neutral-soft",
    "focus-visible:outline-3 focus-visible:-outline-offset-3 focus-visible:outline-focus",
    "disabled:cursor-not-allowed disabled:text-disabled-ink disabled:hover:bg-transparent",
  ],
})

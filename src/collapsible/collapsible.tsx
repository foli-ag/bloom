import { Collapsible as Seed } from "@foliag/seeds/collapsible"
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
 * Something shown or hidden by one button, such as the details of a field. For several in a stack where one opens as
 * another closes, use an Accordion.
 *
 * @example
 * <Collapsible.Root>
 *   <Collapsible.Trigger>Détails de la parcelle</Collapsible.Trigger>
 *   <Collapsible.Content>Sol limoneux, drainé en 2021.</Collapsible.Content>
 * </Collapsible.Root>
 */
export function Root(props: RootProps): Element {
  return <Seed.Root {...omit(props, "class")} class={props.class} />
}

export type TriggerProps = Omit<Seed.TriggerProps, "class" | "children"> & {
  /** The button's words, such as "Voir les détails". Its chevron turns when it opens. */
  children: JSX.Element
  class?: string | undefined
}

export function Trigger(props: TriggerProps): Element {
  return (
    <Seed.Trigger {...omit(props, "class", "children")} class={trigger({ class: props.class })}>
      {props.children}
      <Chevron class={triggerChevron()} />
    </Seed.Trigger>
  )
}

export type ContentProps = Omit<Seed.ContentProps, "class"> & {
  class?: string | undefined
}

/** Grows to its height and fades in as it opens, and folds back the same way. Under reduced motion it only fades. */
export function Content(props: ContentProps): Element {
  return <Seed.Content {...omit(props, "class")} class={disclosureContent({ class: props.class })} />
}

const trigger = tv({
  base: [
    "group/trigger -mx-3 inline-flex min-h-12 pressable items-center gap-2 rounded-control px-3 py-2",
    "text-base font-semibold tracking-body text-primary-text",
    "transition-colors duration-(--duration-smooth) ease-smooth hover:bg-primary-soft focus-ring",
    "disabled:cursor-not-allowed disabled:text-disabled-ink disabled:hover:bg-transparent",
  ],
})

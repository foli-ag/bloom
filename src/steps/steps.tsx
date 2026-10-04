import type { ValidComponent } from "@foliag/seeds/polymorphic"
import { Steps as Seed, useStepsItemContext } from "@foliag/seeds/steps"
import type { JSX } from "@solidjs/web"
import { omit, Show, type Element } from "solid-js"
import { tv } from "tailwind-variants"
import { Mark, tick } from "../internal/icons.jsx"

export type RootProps = Omit<Seed.RootProps, "class"> & {
  /** Merged after the component's own classes, and wins over them */
  class?: string | undefined
}

/**
 * A form cut into steps, such as declaring an intervention: the field, then the product, then a summary. The list
 * shows where the farmer is, and each step's content shows in turn. `count` is the number of steps.
 *
 * Steps run in a row, or down the side with `orientation="vertical"`, which suits a phone when there are more than
 * four of them. Each step is a button that goes back to it unless `linear` is set. Next and Prev are bare buttons
 * that take their look from what they render as, usually a `Button`.
 *
 * @example
 * <Steps.Root count={3}>
 *   <Steps.List>
 *     <Steps.Item index={0}>Parcelle</Steps.Item>
 *     <Steps.Item index={1}>Produit</Steps.Item>
 *     <Steps.Item index={2}>Récapitulatif</Steps.Item>
 *   </Steps.List>
 *   <Steps.Content index={0}>…</Steps.Content>
 *   <Steps.Content index={1}>…</Steps.Content>
 *   <Steps.Content index={2}>…</Steps.Content>
 *   <Steps.CompletedContent>Intervention enregistrée.</Steps.CompletedContent>
 *   <Steps.Prev as={Button} tone="neutral" variant="outline">Précédent</Steps.Prev>
 *   <Steps.Next as={Button}>Suivant</Steps.Next>
 * </Steps.Root>
 */
export function Root(props: RootProps): Element {
  return <Seed.Root {...omit(props, "class")} class={root({ class: props.class })} />
}

export type ListProps = Omit<Seed.ListProps, "class"> & {
  class?: string | undefined
}

/** Holds the steps, in order */
export function List(props: ListProps): Element {
  return <Seed.List {...omit(props, "class")} class={list({ class: props.class })} />
}

export type ItemProps = Omit<Seed.ItemProps, "class" | "children"> & {
  /** The step's name, such as "Parcelle". It is the name of its button, so it is required. */
  children: JSX.Element
  class?: string | undefined
}

/**
 * A step: a circle with its number, or a tick once it is done, its name, and a line to the next one. The current
 * step's circle is filled and ringed, so it does not stand out by color alone.
 */
export function Item(props: ItemProps): Element {
  return (
    <Seed.Item
      {...omit(props, "class", "children")}
      class={item({ class: props.class })}
      // Zag marks the current step's wrapper, inside the tab list, where only tabs may be. Its tab says it is the
      // current one, as selected.
      aria-current={false}
    >
      <Seed.Item.Trigger class={trigger()}>
        <Seed.Indicator as="span" class={indicator()}>
          <StepMark />
        </Seed.Indicator>
        <span class="min-w-0">{props.children}</span>
      </Seed.Item.Trigger>
      <Seed.Separator class={separator()} />
    </Seed.Item>
  )
}

/** The number of the step, or its tick once it is done. Both are hidden from a screen reader, which reads the name. */
function StepMark(): Element {
  const step = useStepsItemContext()
  return (
    <Show when={step().completed} fallback={step().index + 1}>
      <Mark stroke-width={3.5} class="size-5 animate-pop-in">
        <path d={tick} />
      </Mark>
    </Show>
  )
}

export type ContentProps = Omit<Seed.ContentProps, "class"> & {
  class?: string | undefined
}

/** What the step at `index` asks for, shown while it is current. It fades in as the farmer moves to it. */
export function Content(props: ContentProps): Element {
  return <Seed.Content {...omit(props, "class")} class={content({ class: props.class })} />
}

export type CompletedContentProps = Omit<Seed.CompletedContentProps, "class"> & {
  class?: string | undefined
}

/** Shown once the last step is done, such as a confirmation */
export function CompletedContent(props: CompletedContentProps): Element {
  return <Seed.CompletedContent {...omit(props, "class")} class={content({ class: props.class })} />
}

export type NextProps<As extends ValidComponent = "button"> = Seed.Trigger.NextProps<As>

/** Goes to the next step, or past the last one to the completed content. It is disabled once there. */
export const Next: typeof Seed.Trigger.Next = Seed.Trigger.Next

export type PrevProps<As extends ValidComponent = "button"> = Seed.Trigger.PrevProps<As>

/** Goes back a step. It is disabled on the first one. */
export const Prev: typeof Seed.Trigger.Prev = Seed.Trigger.Prev

const root = tv({ base: "grid gap-6" })

const list = tv({
  base: "flex data-[orientation=horizontal]:items-start data-[orientation=vertical]:flex-col",
})

const item = tv({
  base: [
    "group/step relative flex",
    "data-[orientation=horizontal]:flex-1 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:items-center",
    "data-[orientation=vertical]:pb-6 data-[orientation=vertical]:last:pb-0",
  ],
})

// The circle is 40px inside a target of at least 48px. Its center is 24px from the top of the step, which is where
// the line to the next step starts.
const trigger = tv({
  base: [
    "flex min-h-12 pressable gap-2 rounded-control p-1 text-sm font-medium tracking-body text-muted",
    "transition-colors duration-(--duration-smooth) ease-smooth focus-ring",
    "data-current:font-semibold data-current:text-ink data-complete:text-ink",
    "data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:items-center",
    "data-[orientation=horizontal]:text-center",
    "data-[orientation=vertical]:items-center data-[orientation=vertical]:gap-3 data-[orientation=vertical]:text-base",
    "disabled:cursor-default",
  ],
})

const indicator = tv({
  base: [
    "grid size-10 shrink-0 place-items-center rounded-full border-2 border-strong bg-raised text-base font-semibold",
    "text-muted transition-colors duration-(--duration-smooth) ease-smooth",
    "data-current:border-primary-edge data-current:bg-primary data-current:text-on-primary",
    "data-current:outline-2 data-current:outline-offset-2 data-current:outline-primary-edge",
    "data-complete:border-primary-edge data-complete:bg-primary-soft data-complete:text-primary-text",
  ],
})

const separator = tv({
  base: [
    "absolute bg-strong transition-colors duration-(--duration-smooth) ease-smooth group-last/step:hidden",
    "data-complete:bg-primary-edge",
    "data-[orientation=horizontal]:top-6 data-[orientation=horizontal]:h-0.5",
    "data-[orientation=horizontal]:start-[calc(50%+1.75rem)] data-[orientation=horizontal]:end-[calc(-50%+1.75rem)]",
    "data-[orientation=vertical]:start-[1.4375rem] data-[orientation=vertical]:top-13 data-[orientation=vertical]:bottom-1",
    "data-[orientation=vertical]:w-0.5",
  ],
})

const content = tv({ base: "rounded-control focus-ring data-[state=open]:animate-fade-in" })

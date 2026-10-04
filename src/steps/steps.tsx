import type { ValidComponent } from "@foliag/seeds/polymorphic"
import { Steps as Seed, useStepsContext, useStepsItemContext } from "@foliag/seeds/steps"
import type { JSX } from "@solidjs/web"
import { createMemo, omit, type Element } from "solid-js"
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

/**
 * The number of the step, and its tick, one over the other: the tick pops in as the number gives way once the step is
 * done, and the other way round when the farmer goes back to it. Both are hidden from a screen reader, which reads the
 * name.
 */
function StepMark(): Element {
  const step = useStepsItemContext()
  return (
    <>
      <span class={number()}>{step().index + 1}</span>
      <span class={tickMark()}>
        <Mark stroke-width={3.5} class="size-5">
          <path d={tick} />
        </Mark>
      </span>
    </>
  )
}

export type ContentProps = Omit<Seed.ContentProps, "class"> & {
  class?: string | undefined
}

/**
 * What the step at `index` asks for, shown while it is current. It fades in as the farmer moves to it, drifting in from
 * the side they are going: from the end on the way forward, from the start on the way back.
 */
export function Content(props: ContentProps): Element {
  const from = useArrival()
  return <Seed.Content {...omit(props, "class")} data-from={from()} class={content({ class: props.class })} />
}

export type CompletedContentProps = Omit<Seed.CompletedContentProps, "class"> & {
  class?: string | undefined
}

/** Shown once the last step is done, such as a confirmation. It comes in as the next step would. */
export function CompletedContent(props: CompletedContentProps): Element {
  const from = useArrival()
  return <Seed.CompletedContent {...omit(props, "class")} data-from={from()} class={content({ class: props.class })} />
}

/**
 * Where the farmer came from to the step now shown: the step `before` it or the one `after` it. Nothing until the step
 * first changes, so what shows with the screen is there at once.
 */
function useArrival(): () => "before" | "after" | undefined {
  const api = useStepsContext()
  const move = createMemo<{ step: number; from?: "before" | "after" }>((last) => {
    const step = api().value
    if (last === undefined || step === last.step) return last ?? { step }
    return { step, from: step > last.step ? "before" : "after" }
  })
  return () => move().from
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
// the line to the next step starts. Only the color of its words eases, so the focus ring shows at once, where
// `transition-colors` would ease its color in too.
const trigger = tv({
  base: [
    "flex min-h-12 pressable gap-2 rounded-control p-1 text-sm font-medium tracking-body text-muted",
    "transition-[color] duration-(--duration-smooth) ease-smooth focus-ring",
    "data-current:font-semibold data-current:text-ink data-complete:text-ink",
    "data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:items-center",
    "data-[orientation=horizontal]:text-center",
    "data-[orientation=vertical]:items-center data-[orientation=vertical]:gap-3 data-[orientation=vertical]:text-base",
    "disabled:cursor-default",
  ],
})

// The ring around the current step is a `::after` 2px out from the circle. It pops in around the step the farmer moves
// to as it shrinks away from the one they leave, on the same clock as the colors. As an outline it showed at once, grey
// for a moment while its color caught up.
const indicator = tv({
  base: [
    "group/indicator relative grid size-10 shrink-0 place-items-center rounded-full border-2 border-strong bg-raised",
    "text-base font-semibold text-muted",
    "transition-[color,background-color,border-color] duration-(--duration-smooth) ease-smooth",
    "data-current:border-primary-edge data-current:bg-primary data-current:text-on-primary",
    "data-complete:border-primary-edge data-complete:bg-primary-soft data-complete:text-primary-text",
    "after:absolute after:-inset-1.5 after:rounded-full after:border-2 after:border-primary-edge after:content-['']",
    "after:scale-(--pop-in-scale) after:opacity-0 data-current:after:scale-100 data-current:after:opacity-100",
    "after:transition-[scale,opacity] after:duration-(--duration-exit) after:ease-smooth",
    "data-current:after:duration-(--duration-pop) data-current:after:ease-pop",
  ],
})

// The number and the tick share the middle of the circle. The one that appears grows in on the pop spring as the
// other shrinks away, quicker, so the two are not read over each other. Transitions and not keyframes, so a quick Prev
// after Next turns them round half way, and nothing pops as the page loads.
const number = tv({
  base: [
    "[grid-area:1/1] transition-[scale,opacity] duration-(--duration-pop) ease-pop",
    "group-data-complete/indicator:scale-(--pop-in-scale) group-data-complete/indicator:opacity-0",
    "group-data-complete/indicator:duration-(--duration-exit) group-data-complete/indicator:ease-smooth",
  ],
})

const tickMark = tv({
  base: [
    "[grid-area:1/1] scale-(--pop-in-scale) opacity-0",
    "transition-[scale,opacity] duration-(--duration-exit) ease-smooth",
    "group-data-complete/indicator:scale-100 group-data-complete/indicator:opacity-100",
    "group-data-complete/indicator:duration-(--duration-pop) group-data-complete/indicator:ease-pop",
  ],
})

// The line to the next step fills with green from the step done toward the next one, and drains back toward it when
// the farmer goes back: a `::after` over the grey line, scaled from its start. Under reduced motion it is drawn whole
// and fades instead (`--steps-line-scale`).
const separator = tv({
  base: [
    "absolute bg-strong group-last/step:hidden",
    "after:absolute after:inset-0 after:bg-primary-edge after:content-['']",
    "after:opacity-[calc(1-var(--steps-line-scale))] data-complete:after:opacity-100",
    "after:transition-[scale,opacity] after:duration-(--duration-smooth) after:ease-smooth",
    "data-[orientation=horizontal]:top-6 data-[orientation=horizontal]:h-0.5",
    "data-[orientation=horizontal]:start-[calc(50%+1.75rem)] data-[orientation=horizontal]:end-[calc(-50%+1.75rem)]",
    "data-[orientation=horizontal]:after:origin-left rtl:data-[orientation=horizontal]:after:origin-right",
    "data-[orientation=horizontal]:after:scale-x-(--steps-line-scale)",
    "data-[orientation=horizontal]:data-complete:after:scale-x-100",
    "data-[orientation=vertical]:start-[1.4375rem] data-[orientation=vertical]:top-13 data-[orientation=vertical]:bottom-1",
    "data-[orientation=vertical]:w-0.5 data-[orientation=vertical]:after:origin-top",
    "data-[orientation=vertical]:after:scale-y-(--steps-line-scale)",
    "data-[orientation=vertical]:data-complete:after:scale-y-100",
  ],
})

// A step's page fades in from `@starting-style`, 8px in from the side the farmer is going, which `data-from` says
const content = tv({
  base: [
    "rounded-control focus-ring [--from-side:1] rtl:[--from-side:-1]",
    "transition-[opacity,translate] duration-(--duration-smooth) ease-smooth",
    "data-from:starting:opacity-0",
    "data-[from=before]:starting:translate-x-[calc(var(--enter-distance)*2/3*var(--from-side))]",
    "data-[from=after]:starting:translate-x-[calc(var(--enter-distance)*-2/3*var(--from-side))]",
  ],
})

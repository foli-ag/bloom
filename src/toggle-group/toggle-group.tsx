import { ToggleGroup as Seed } from "@foliag/seeds/toggle-group"
import type { JSX } from "@solidjs/web"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"
import { Mark, tick } from "../internal/icons.jsx"

export type RootProps = Omit<Seed.RootProps, "class"> & {
  /** Merged after the component's own classes, and wins over them. `w-full` stretches the segments to the row. */
  class?: string | undefined
}

/**
 * A short row of options pressed like buttons, such as a day, a week or a month. One at a time behaves like a radio
 * group, and `multiple` like a row of toggle buttons. The group has no visible label of its own, so give it
 * `aria-label` or `aria-labelledby`.
 *
 * The segments are all as wide as the widest, so the row reads as one control and nothing moves when the choice does.
 *
 * @example
 * <ToggleGroup.Root aria-label="Période" defaultValue={["semaine"]}>
 *   <ToggleGroup.Item value="jour">Jour</ToggleGroup.Item>
 *   <ToggleGroup.Item value="semaine">Semaine</ToggleGroup.Item>
 * </ToggleGroup.Root>
 */
export function Root(props: RootProps): Element {
  return <Seed.Root {...omit(props, "class")} class={root({ class: props.class })} />
}

export type ItemProps = Omit<Seed.ItemProps, "class" | "children"> & {
  /** The option's words. They are its accessible name, so there is no default. */
  children: JSX.Element
  class?: string | undefined
}

/**
 * One option, at least 48px tall. A pressed one fills with the primary color and a tick springs in before its words,
 * which slide over to make room inside the segment.
 */
export function Item(props: ItemProps): Element {
  return (
    <Seed.Item {...omit(props, "class", "children")} class={item({ class: props.class })}>
      <span class={words()}>
        <Mark stroke-width={3.5} class={pressedTick()}>
          <path d={tick} />
        </Mark>
        {props.children}
      </span>
    </Seed.Item>
  )
}

// Equal tracks in a grid size every segment to the widest. Segments share their edges: each one pulls 2px over the one
// before it, the first into the group's own 2px, and the pressed or focused one rises above so its whole edge shows.
const root = tv({
  base: [
    "inline-grid data-[orientation=horizontal]:auto-cols-fr data-[orientation=horizontal]:grid-flow-col data-[orientation=horizontal]:ps-0.5",
    "data-[orientation=vertical]:auto-rows-fr data-[orientation=vertical]:grid-flow-row data-[orientation=vertical]:pt-0.5",
  ],
})

// The padding holds half the tick on each side, so the words and the tick stay inside a segment that fits the words
const item = tv({
  base: [
    "group/item relative inline-flex min-h-12 pressable items-center justify-center border-2 border-strong bg-raised px-5 py-2",
    "text-base font-semibold tracking-body text-ink",
    "motion-press hover:z-10 hover:border-ink focus-visible:z-20 focus-ring",
    "data-[state=on]:z-10 data-[state=on]:border-primary-edge data-[state=on]:bg-primary data-[state=on]:text-on-primary",
    "data-[state=on]:hover:bg-primary-400",
    "data-disabled:cursor-not-allowed data-disabled:border-disabled data-disabled:bg-disabled data-disabled:text-disabled-ink",
    "data-[orientation=horizontal]:-ms-0.5 data-[orientation=horizontal]:first:rounded-s-control data-[orientation=horizontal]:last:rounded-e-control",
    "data-[orientation=vertical]:-mt-0.5 data-[orientation=vertical]:first:rounded-t-control data-[orientation=vertical]:last:rounded-b-control",
  ],
})

// Half of the tick and its gap, 12px, so the tick and the words are centered together
const words = tv({
  base: [
    "relative transition-[translate] duration-(--duration-smooth) ease-smooth",
    "group-data-[state=on]/item:translate-x-3 rtl:group-data-[state=on]/item:-translate-x-3",
  ],
})

const pressedTick = tv({
  base: [
    "absolute end-full top-1/2 me-1 size-5 -translate-y-1/2 scale-50 opacity-0",
    "[transition:scale_var(--duration-pop)_var(--ease-pop),opacity_var(--duration-smooth)_var(--ease-smooth)]",
    "group-data-[state=on]/item:scale-100 group-data-[state=on]/item:opacity-100",
  ],
})

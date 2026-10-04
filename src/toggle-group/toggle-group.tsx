import { ToggleGroup as Seed } from "@foliag/seeds/toggle-group"
import type { JSX } from "@solidjs/web"
import { type Accessor, createContext, omit, Show, useContext, type Element } from "solid-js"
import { tv } from "../internal/variants.js"
import {
  createPill,
  pill,
  pillMiddle,
  pillPresence,
  segment,
  segmentedTrack,
  segmentWords,
} from "../internal/choice.js"
import { Mark, tick } from "../internal/icons.jsx"

type Variant = "outline" | "segmented"

// The root's look, read by its items. A context and not a class on the root, so a group inside another one takes its
// own look.
const RootVariant = /* @__PURE__ */ createContext<Accessor<Variant>>(() => "outline")

export type RootProps = Omit<Seed.RootProps, "class"> & {
  /**
   * How it looks. `outline`, the default: a row of outlined segments, the pressed ones filled green with a tick.
   * `segmented`: the options sit in a track, and a pill slides behind the chosen one, as on a phone. With `multiple`
   * each pressed option has a pill of its own, which fades in and out where it is.
   */
  variant?: Variant | undefined
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
 *
 * <ToggleGroup.Root variant="segmented" aria-label="Affichage" defaultValue={["liste"]}>
 *   <ToggleGroup.Item value="liste">Liste</ToggleGroup.Item>
 *   <ToggleGroup.Item value="carte">Carte</ToggleGroup.Item>
 * </ToggleGroup.Root>
 */
export function Root(props: RootProps): Element {
  const variant = () => props.variant ?? "outline"
  return (
    <RootVariant value={variant}>
      <Seed.Root
        {...omit(props, "class", "variant", "children")}
        class={root({ variant: variant(), class: props.class })}
      >
        <Show when={variant() === "segmented" && !props.multiple}>
          <Pill orientation={props.orientation ?? "horizontal"} disabled={props.disabled === true} />
        </Show>
        {props.children}
      </Seed.Root>
    </RootVariant>
  )
}

// Zag gives a toggle group no indicator, so the segmented look places its pill itself, the way zag places a tab's,
// behind the item that is on
function Pill(props: { orientation: "horizontal" | "vertical"; disabled: boolean }): Element {
  const place = createPill((track) =>
    track.querySelector<HTMLElement>(`[data-ownedby="${CSS.escape(track.id)}"][data-state="on"]`),
  )
  return (
    <span
      ref={place.presence}
      aria-hidden="true"
      data-state={place.shown() ? "on" : "off"}
      data-settled={place.settled() ? "" : undefined}
      class={pillPresence()}
    >
      <span
        ref={place.shape}
        data-scope="toggle-group"
        data-part="indicator"
        data-orientation={props.orientation}
        data-disabled={props.disabled ? "" : undefined}
        style={place.style()}
        class={`group/pill ${pill()}`}
      >
        <span class={pillMiddle()} />
      </span>
    </span>
  )
}

export type ItemProps = Omit<Seed.ItemProps, "class" | "children"> & {
  /** The option's words. They are its accessible name, so there is no default. */
  children: JSX.Element
  class?: string | undefined
}

/**
 * One option, at least 48px tall. A pressed one fills with the primary color and a tick springs in before its words,
 * which slide over to make room inside the segment. In a `segmented` group the pill behind it shows it is chosen.
 */
export function Item(props: ItemProps): Element {
  const variant = useContext(RootVariant)
  return (
    <Show
      when={variant() === "segmented"}
      fallback={
        <Seed.Item {...omit(props, "class", "children")} class={item({ class: props.class })}>
          <span class={words()}>
            <Mark stroke-width={3.5} class={pressedTick()}>
              <path d={tick} />
            </Mark>
            {props.children}
          </span>
        </Seed.Item>
      }
    >
      <Seed.Item {...omit(props, "class", "children")} class={segmentItem({ class: props.class })}>
        <span class={segmentWords()}>{props.children}</span>
      </Seed.Item>
    </Show>
  )
}

// Equal tracks in a grid size every segment to the widest. Outlined segments share their edges: each one pulls 2px over
// the one before it, the first into the group's own 2px, and the pressed or hovered one rises above so its whole edge
// shows. Segmented ones sit side by side inside the track.
const root = tv({
  base: [
    "inline-grid data-[orientation=horizontal]:auto-cols-fr data-[orientation=horizontal]:grid-flow-col",
    "data-[orientation=vertical]:auto-rows-fr data-[orientation=vertical]:grid-flow-row",
  ],
  variants: {
    variant: {
      outline: "data-[orientation=horizontal]:ps-0.5 data-[orientation=vertical]:pt-0.5",
      segmented: [segmentedTrack(), "data-disabled:border-disabled data-disabled:bg-disabled"],
    },
  },
})

// The padding holds half the tick on each side, so the words and the tick stay inside a segment that fits the words.
//
// A segment does not shrink under the finger as a lone button does, which would pull its edges off its neighbors'. Its
// fill darkens in 90ms instead, or lightens on a segment that is on, and its words go down a little (`words`). The focus
// ring is the segment's edge in the focus color, so it covers no neighbor, and the focused segment rises above its
// neighbors so its whole edge shows. A disabled segment is grey whatever its state, which its tick still shows.
const item = tv({
  base: [
    "group/item relative inline-flex min-h-12 pressable items-center justify-center border-2 border-strong bg-raised px-5 py-2",
    "text-base font-semibold tracking-body text-ink",
    "[transition:background-color_var(--press-duration,var(--duration-smooth))_var(--press-ease,var(--ease-smooth)),border-color_var(--duration-smooth)_var(--ease-smooth),color_var(--duration-smooth)_var(--ease-smooth)]",
    "hover:z-10 hover:border-ink active:bg-neutral-soft",
    "focus-ring focus-visible:z-20",
    "data-[state=on]:z-10 not-data-disabled:data-[state=on]:border-primary-edge not-data-disabled:data-[state=on]:bg-primary",
    "not-data-disabled:data-[state=on]:text-on-primary",
    "not-data-disabled:data-[state=on]:hover:bg-primary-400 data-[state=on]:active:bg-primary-300",
    "data-disabled:cursor-not-allowed data-disabled:border-disabled data-disabled:bg-disabled data-disabled:text-disabled-ink",
    "data-[orientation=horizontal]:-ms-0.5 data-[orientation=horizontal]:first:rounded-s-control data-[orientation=horizontal]:last:rounded-e-control",
    "data-[orientation=vertical]:-mt-0.5 data-[orientation=vertical]:first:rounded-t-control data-[orientation=vertical]:last:rounded-b-control",
  ],
})

// The words keep their color whether the pill is behind them or not, so they read at 7:1 on it and on the track at
// every moment of the slide. With `multiple` there is no one place for a sliding pill: each pressed option draws a pill
// of its own, its `::after`, which fades in and out where it is, under its tint and its words.
const segmentItem = tv({
  base: [
    segment(),
    "isolate text-ink",
    "after:pointer-events-none after:absolute after:inset-(--pill-inset) after:-z-10 after:rounded-(--pill-radius) after:content-['']",
    "after:border-2 after:border-primary-edge after:bg-primary-soft after:opacity-0",
    "after:[transition:opacity_var(--duration-exit)_var(--ease-smooth)]",
    "aria-pressed:after:opacity-100 aria-pressed:after:[transition:opacity_var(--duration-smooth)_var(--ease-smooth)]",
    "data-disabled:after:border-disabled-ink data-disabled:after:bg-raised",
  ],
})

// Half of the tick and its gap, 12px, so the tick and the words are centered together. They cross on
// `--duration-travel`, at once under reduced motion. Under the finger they go down as a button does, in 90ms,
// and come back up on the pop spring.
const words = tv({
  base: [
    "relative",
    "[transition:translate_var(--duration-travel)_var(--ease-smooth),scale_var(--press-duration,var(--duration-pop))_var(--press-ease,var(--ease-pop))]",
    "group-data-[state=on]/item:translate-x-3 rtl:group-data-[state=on]/item:-translate-x-3",
    "group-active/item:scale-(--press-scale)",
  ],
})

// The tick pops in on the lively spring as the segment is pressed, and fades and shrinks on the quicker exit clock as it
// is let go, with nothing past its end. Under reduced motion it only fades.
const pressedTick = tv({
  base: [
    "absolute end-full top-1/2 me-1 size-5 -translate-y-1/2 scale-(--pop-in-scale) opacity-0",
    "[transition:scale_var(--duration-exit)_var(--ease-smooth),opacity_var(--duration-exit)_var(--ease-smooth)]",
    "group-data-[state=on]/item:scale-100 group-data-[state=on]/item:opacity-100",
    "group-data-[state=on]/item:[transition:scale_var(--duration-pop)_var(--ease-pop),opacity_var(--duration-exit)_var(--ease-smooth)]",
  ],
})

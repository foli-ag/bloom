import { Progress as Seed, useProgressContext } from "@foliag/seeds/progress"
import { createMemo, omit, Repeat, Show, untrack, type Element } from "solid-js"
import { tv } from "../internal/variants.js"
import { useProgressLook } from "./progress-look.js"

export type ProgressRangeProps = Omit<Seed.RangeProps, "class"> & {
  class?: string | undefined
}

/**
 * The filled part of the bar. It slides in from the start on the smooth spring as the value moves, by its translate so
 * nothing is laid out again. While the value is not known, a short piece slides along the bar.
 *
 * On a `segmented` root it is a row of segments, one per step, and the steps the value reaches fill one after the
 * other, from the start when it grows and from the end when it shrinks.
 */
export function ProgressRange(props: ProgressRangeProps): Element {
  const look = useProgressLook()
  const segmented = () => look?.segmented() ?? false
  return (
    <Seed.Range {...omit(props, "class", "children")} class={range({ segmented: segmented(), class: props.class })}>
      <Show when={segmented()} fallback={props.children}>
        <Segments />
      </Show>
    </Seed.Range>
  )
}

/**
 * One segment per whole step between `min` and `max`. Each fill slides in from behind its segment's start, solid, and
 * back out when the value drops, so its leading end stays round. Under reduced motion it fades in place instead
 * (`--sheet-distance` and `--sheet-from-opacity`, the tokens of what comes in from an edge).
 *
 * A change of several steps fills them one by one: each segment that has to move waits its turn (`--segment-order`),
 * set in the same update as its state, so the delay is the one its transition starts with. A segment caught half way
 * by a change of mind turns round at once, without waiting, and one still waiting its turn has not moved and needs
 * nothing. Nothing moves on the first render.
 */
function Segments(): Element {
  const api = useProgressContext()
  const count = () => Math.max(0, Math.round(api().max - api().min))
  const filled = () => {
    const value = api().value
    if (value === null) return 0
    return Math.min(count(), Math.max(0, Math.floor(value - api().min + 1e-9)))
  }
  const fills: (HTMLElement | undefined)[] = []
  const plan = createMemo<{ filled: number; order: number[] }>((previous) => {
    const next = filled()
    if (!previous) return { filled: next, order: [] }
    return { filled: next, order: untrack(() => stagger(previous.filled, next, fills)) }
  })
  return (
    <Repeat count={count()}>
      {(index) => (
        <span class={segment()}>
          <span
            ref={(element) => (fills[index] = element)}
            data-filled={index < plan().filled ? "" : undefined}
            style={{ "--segment-order": String(plan().order[index] ?? 0) }}
            class={fill()}
          />
        </span>
      )}
    </Repeat>
  )
}

/** The turn of each segment that changes, in the order the change runs: from the start up, or from the end down */
function stagger(from: number, to: number, fills: readonly (HTMLElement | undefined)[]): number[] {
  const order: number[] = []
  const changing = to > from ? steps(from, to) : steps(to, from).reverse()
  let turn = 0
  for (const index of changing) {
    const motion = phase(fills[index])
    if (motion === "waiting") continue
    order[index] = motion === "moving" ? 0 : turn++
  }
  return order
}

function steps(start: number, end: number) {
  return Array.from({ length: Math.max(0, end - start) }, (_, offset) => start + offset)
}

/** Whether a fill is still, on its way, or still waiting for its turn and so where it was */
function phase(fill: HTMLElement | undefined): "still" | "moving" | "waiting" {
  const running = fill?.getAnimations().filter((animation) => animation.playState === "running") ?? []
  if (running.length === 0) return "still"
  const started = running.some((animation) => {
    const delay = Number(animation.effect?.getTiming().delay ?? 0)
    return Number(animation.currentTime ?? 0) >= delay
  })
  return started ? "moving" : "waiting"
}

// The green of an edge and not the brand fill, because it is what shows how much, and the brand green is only 2.5:1.
// Zag sizes it with an inline width; it spans the bar instead and slides out from behind the start to `--percent`,
// which the root sets, so its leading end stays round at any value where a scaled one would be squashed flat. The bar
// clips what is still behind the start. The piece that slides while the value is not known starts out of sight on the
// left, and runs the other way from right to left. Its color is the tone's, and eases when the tone changes.
const range = tv({
  base: "h-full !w-full",
  variants: {
    segmented: {
      false: [
        "rounded-full bg-(--progress-fill)",
        "translate-x-[calc((var(--percent)-100)*1%)] rtl:translate-x-[calc((100-var(--percent))*1%)]",
        "transition-[translate,background-color] duration-(--duration-smooth) ease-smooth",
        "data-[state=indeterminate]:absolute data-[state=indeterminate]:left-0 data-[state=indeterminate]:!w-1/3",
        "data-[state=indeterminate]:animate-progress-slide rtl:[animation-direction:reverse]",
      ],
      true: "flex gap-1",
    },
  },
  defaultVariants: { segmented: false },
})

// Each segment has the bar's own 2px edge, 3:1 against the page, so the steps still to come can be counted
const segment = tv({
  base: "relative h-full min-w-0 flex-1 overflow-hidden rounded-full border-2 border-strong bg-neutral-soft",
})

// A step takes a sixth of its clock to start after the one before it, so the fills run as one wave. Filling takes the
// smooth spring; emptying the quicker exit clock, as what leaves does.
const fill = tv({
  base: [
    "absolute inset-0 rounded-full bg-(--progress-fill)",
    "translate-x-[calc(var(--sheet-distance)*-1)] rtl:translate-x-(--sheet-distance) opacity-(--sheet-from-opacity)",
    "[--fill-clock:var(--duration-exit)] data-filled:[--fill-clock:var(--duration-smooth)]",
    "[--fill-turn:calc(var(--segment-order)*var(--fill-clock)/6)]",
    "[transition:translate_var(--fill-clock)_var(--ease-smooth)_var(--fill-turn),opacity_var(--fill-clock)_var(--ease-smooth)_var(--fill-turn),background-color_var(--duration-smooth)_var(--ease-smooth)]",
    "data-filled:translate-x-0 data-filled:opacity-100",
  ],
})

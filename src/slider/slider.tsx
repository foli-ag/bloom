import { Slider as Seed, useSliderContext } from "@foliag/seeds/slider"
import type { JSX } from "@solidjs/web"
import { createMemo, createUniqueId, For, omit, Show, untrack, type Element } from "solid-js"
import { tv } from "../internal/variants.js"
import { createFollowing, forwardRef, notePointer } from "../internal/pointer.js"

export type RootProps = Omit<Seed.RootProps, "class"> & {
  /** Merged after the component's own classes, and wins over them */
  class?: string | undefined
}

/**
 * A value picked along a line, such as a quantity or a level. The label sits on the left and the value on the right,
 * with the line under both. A handle is hard to land on exactly with a gloved thumb, so show the number, and give the
 * farmer a way to type it when it has to be exact.
 *
 * With two values it is a range, and each handle needs its own name: give `Control` a `Thumb` for each.
 *
 * @example
 * <Slider.Root name="humidite" defaultValue={[40]} min={0} max={100} step={5}>
 *   <Slider.Label>Humidité du sol</Slider.Label>
 *   <Slider.ValueText>{(value) => `${value[0]} %`}</Slider.ValueText>
 *   <Slider.Control />
 * </Slider.Root>
 */
export function Root(props: RootProps): Element {
  return <Seed.Root {...omit(props, "class")} class={root({ class: props.class })} />
}

export type LabelProps = Omit<Seed.LabelProps, "class" | "children"> & {
  /** What the slider sets. It is the slider's accessible name, so there is no default. */
  children: JSX.Element
  class?: string | undefined
}

export function Label(props: LabelProps): Element {
  return <Seed.Label {...omit(props, "class")} class={label({ class: props.class })} />
}

export type ValueTextProps = Omit<Seed.ValueTextProps, "class" | "children"> & {
  /**
   * The value as the farmer reads it, with its unit, ``(value) => `${value[0]} %` ``. There is no default, because the
   * plain numbers joined by a comma, "20,70", read in French as one number with decimals.
   */
  children: (value: number[]) => JSX.Element
  class?: string | undefined
}

export function ValueText(props: ValueTextProps): Element {
  const api = useSliderContext()
  return (
    <Seed.ValueText {...omit(props, "class", "children")} class={valueText({ class: props.class })}>
      {props.children(api().value)}
    </Seed.ValueText>
  )
}

export type ControlProps = Omit<Seed.ControlProps, "class"> & {
  /** One `Thumb` for each value, named. With none, there is one unnamed handle for each value. */
  children?: JSX.Element
  class?: string | undefined
}

/**
 * The line and its handles. A handle is 28px inside a 48px target that reaches a finger's width.
 *
 * A press on the line, an arrow key or Page Up glides the handle and the filled part to the new value, together, on the
 * smooth spring. Once the finger moves, they follow it exactly, with nothing easing behind it.
 */
export function Control(props: ControlProps): Element {
  const api = useSliderContext()
  const rest = omit(props, "class", "children")
  const [following, follow] = createFollowing()
  // Which handle is which is its position, not its value, so the list is a count and the handles are not rebuilt
  // while one is dragged
  const count = createMemo(() => api().value.length)
  const positions = createMemo(() => Array.from({ length: count() }, (_, index) => index))
  // Where the filled part starts and ends along the line, as zag works them out for the origin and the values
  const extent = createMemo(() => {
    const style = api().getRootProps().style as Record<string, string>
    const from = Number.parseFloat(style["--slider-range-start"] ?? "0") / 100
    const to = 1 - Number.parseFloat(style["--slider-range-end"] ?? "0") / 100
    return { from, size: Math.max(0, to - from) }
  })
  return (
    <Seed.Control
      {...rest}
      ref={(element: HTMLElement) => {
        follow(element)
        notePointer(element)
        forwardRef(
          untrack(() => rest.ref),
          element,
        )
      }}
      data-following={following() ? "" : undefined}
      class={control({ class: props.class })}
    >
      <Seed.Track class={track()}>
        <Seed.Range
          class={range()}
          style={{ left: "0", right: "0", "--slider-from": `${extent().from}`, "--slider-size": `${extent().size}` }}
        />
      </Seed.Track>
      <Show when={props.children} fallback={<For each={positions()}>{(index) => <Thumb index={index} />}</For>}>
        {props.children}
      </Show>
    </Seed.Control>
  )
}

export type ThumbProps = Omit<Seed.ThumbProps, "class" | "children"> & {
  /**
   * What this handle sets, such as "Minimum". A screen reader says it before the slider's label, "Minimum, Humidité du
   * sol". Leave it out when the slider has one handle.
   */
  children?: JSX.Element
  class?: string | undefined
}

export function Thumb(props: ThumbProps): Element {
  const api = useSliderContext()
  const nameId = createUniqueId()
  return (
    <span class={rail()} style={{ "--slider-at": `${api().getThumbPercent(props.index)}` }}>
      <Seed.Thumb
        {...omit(props, "class", "children")}
        class={thumb({ class: props.class })}
        // At the start of its rail, which moves it, centered on that point by its own translate. Zag centers it with a
        // transform, which the scale of a held handle would scale too, pulling it 3.5px off its value.
        style={{ "inset-inline-start": "0", transform: "none" }}
        // The handle's name is its own words followed by the label. Said the other way round, both handles of a range
        // would be named like the slider.
        aria-labelledby={props.children ? `${nameId} ${api().getLabelProps().id}` : undefined}
      >
        <Show when={props.children}>
          <span id={nameId} class="sr-only">
            {props.children}
          </span>
        </Show>
        <Seed.HiddenInput />
      </Seed.Thumb>
    </span>
  )
}

const root = tv({ base: "grid w-full grid-cols-[1fr_auto] items-center gap-x-4" })

const label = tv({
  base: "text-base font-semibold tracking-body text-ink data-disabled:text-disabled-ink",
})

// The value is information, so it stays readable when the slider is disabled
const valueText = tv({
  base: "text-base font-semibold tracking-body text-ink tabular-nums data-disabled:text-muted",
})

// `--slider-glide` is how long the handles and the filled part take to reach a new value: the travel time, at once under
// reduced motion, and nothing while they follow the pointer. A held handle grows by `--hold-scale`. The handle's focus
// ring is gone after a press, as the ring is the keyboard's.
const control = tv({
  base: [
    "group/control relative col-span-2 flex h-12 w-full items-center data-disabled:cursor-not-allowed",
    "data-pointer:[--focus-style:none]",
    "[--slider-glide:var(--duration-travel)] data-following:[--slider-glide:0s]",
  ],
})

// The line has a 2px edge that reaches 3:1 against the page. The filled part is the green of an edge and not the brand
// fill, because it is what shows how much, and the brand green is only 2.5:1.
const track = tv({
  base: [
    "h-3 flex-1 overflow-hidden rounded-full border-2 border-strong bg-neutral-soft",
    "data-disabled:border-disabled data-disabled:bg-disabled data-invalid:border-danger-text",
  ],
})

// The filled part spans the whole line, and is moved to where it starts and shrunk to its length, which the compositor
// does without laying anything out. Its ends are under a handle or cut round by the line, so the shrinking never shows.
const range = tv({
  base: [
    "h-full origin-left bg-primary-edge rtl:origin-right",
    "[translate:calc(var(--slider-from)*100%)_0] rtl:[translate:calc(var(--slider-from)*-100%)_0]",
    "[scale:var(--slider-size)_1] transition-[translate,scale] duration-(--slider-glide) ease-smooth",
    "data-disabled:bg-disabled-ink data-invalid:bg-danger-text",
  ],
})

// The line a handle travels along: as long as the control less the handle, measured by zag, so that the handle stays
// inside the line at both ends. It is moved by its share of its own length, so the handle glides on the compositor and
// a change in width moves it at once instead of easing. It takes no presses, the handle in it does.
const rail = tv({
  base: [
    "pointer-events-none absolute inset-y-0 z-10 flex items-center has-data-focus:z-20",
    "start-[calc(var(--slider-thumb-width,0px)/2)] end-[calc(var(--slider-thumb-width,0px)/2)]",
    "[translate:calc(var(--slider-at)*100%)_0] rtl:[translate:calc(var(--slider-at)*-100%)_0]",
    "transition-[translate] duration-(--slider-glide) ease-smooth",
  ],
})

// The handle's target is a 48px square around it. It grows as soon as it is held and settles back when let go. Zag marks
// the control invalid and not the handle, which takes a second, inner line then, as a field does, so that the change is
// not a color alone.
const thumb = tv({
  base: [
    "pointer-events-auto size-7 -translate-x-1/2 rounded-full border-2 border-primary-edge bg-primary rtl:translate-x-1/2",
    "before:absolute before:-inset-2.5 before:content-['']",
    "motion-touch data-dragging:[--press-duration:var(--duration-press)] data-dragging:[--press-ease:var(--ease-press)]",
    "hover:bg-primary-400 data-dragging:scale-(--hold-scale) data-dragging:bg-primary-300",
    "focus-ring",
    "data-disabled:border-disabled data-disabled:bg-disabled-ink",
    "group-data-invalid/control:border-danger-text group-data-invalid/control:shadow-[inset_0_0_0_1px_var(--color-danger-text)]",
  ],
})

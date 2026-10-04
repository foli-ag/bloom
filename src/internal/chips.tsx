import type { JSX } from "@solidjs/web"
import {
  createContext,
  createEffect,
  createSignal,
  flush,
  For,
  onSettled,
  untrack,
  useContext,
  type Element,
} from "solid-js"
import { tv, type VariantProps } from "tailwind-variants"
import { badgeLook } from "./badge.js"
import { cross, Mark } from "./icons.jsx"

/*
 * The chips of a select or a combobox that holds several choices: each choice as a badge in the field, with a button
 * that takes it out. Shared by both, which only differ in how they take a value out.
 */

interface Entry<T> {
  value: string
  item: T
  present: boolean
}

interface ChipPresenceState {
  present: () => boolean
  leave: () => void
}

const ChipPresence = /* @__PURE__ */ createContext<ChipPresenceState | undefined>(undefined)
const ChipRemove = /* @__PURE__ */ createContext<(() => void) | undefined>(undefined)

export interface ChipGroupProps<T> {
  scope: string
  /** The chosen items, in the order they were chosen */
  items: readonly T[]
  valueOf: (item: T) => string
  /** A chip for an item */
  children: (item: T) => JSX.Element
}

/**
 * The chips, in the field's own row, before its input or its trigger, so they wrap with them. A chip taken out stays
 * while it leaves, and one chosen again as it leaves turns round where it is. Once it has left, the chips after it, and
 * the input, slide back into the room it leaves: they are measured before and after, and each glides on the compositor
 * from where it was (`translate`), on the travel clock, which reduced motion makes instant. Nothing animates as the
 * page loads.
 */
export function ChipGroup<T>(props: ChipGroupProps<T>): Element {
  const [entries, setEntries] = createSignal<Entry<T>[]>(
    untrack(() => props.items.map((item) => ({ value: props.valueOf(item), item, present: true }))),
  )
  createEffect(
    () => props.items.map((item) => ({ value: props.valueOf(item), item })),
    (chosen) => {
      setEntries((before) => follow(before, chosen))
    },
  )
  // Chips there from the start appear with the page; from two frames on, a new one pops in
  const [settled, setSettled] = createSignal(false)
  onSettled(() => {
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => setSettled(true))
    })
    return () => cancelAnimationFrame(frame)
  })
  let group: HTMLElement | undefined
  const leave = (value: string) => {
    const field = group?.parentElement
    const moving = field ? inFlow(field).filter((element) => element.getAttribute("data-value") !== value) : []
    const before = new Map(moving.map((element) => [element, element.getBoundingClientRect()]))
    setEntries((now) => now.filter((entry) => entry.value !== value || entry.present))
    flush()
    if (field) slideBack(field, before)
  }
  return (
    <div
      ref={(element) => (group = element)}
      data-scope={props.scope}
      data-part="chip-group"
      data-settled={settled() ? "" : undefined}
      class="group/chips contents"
    >
      <For each={entries()} keyed={(entry) => entry.value}>
        {(entry) => (
          <ChipPresence value={{ present: () => entry().present, leave: () => leave(untrack(entry).value) }}>
            {props.children(untrack(entry).item)}
          </ChipPresence>
        )}
      </For>
    </div>
  )
}

/** The chips go on as chosen: a chip whose value is gone starts to leave, one chosen again stays, a new one comes last */
function follow<T>(before: Entry<T>[], chosen: { value: string; item: T }[]): Entry<T>[] {
  const now = new Map(chosen.map((entry) => [entry.value, entry.item]))
  const next = before.map((entry) => {
    const item = now.get(entry.value)
    if (item !== undefined) return entry.present && entry.item === item ? entry : { ...entry, item, present: true }
    return entry.present ? { ...entry, present: false } : entry
  })
  for (const entry of chosen)
    if (!before.some((kept) => kept.value === entry.value)) next.push({ ...entry, present: true })
  return next
}

/** What flows in the field's rows: its chips and its input, and not what it lays over them, a trigger or a chevron */
function inFlow(field: HTMLElement): HTMLElement[] {
  const children = [...field.children].flatMap((child) =>
    child.getAttribute("data-part") === "chip-group" ? [...child.children] : [child],
  )
  return children.filter(
    (child): child is HTMLElement => child instanceof HTMLElement && getComputedStyle(child).position !== "absolute",
  )
}

function slideBack(field: HTMLElement, before: Map<HTMLElement, DOMRect>) {
  const style = getComputedStyle(field)
  const travel = style.getPropertyValue("--duration-travel").trim()
  const duration = travel.endsWith("ms") ? Number.parseFloat(travel) : Number.parseFloat(travel) * 1000
  for (const [element, was] of before) {
    for (const animation of element.getAnimations()) if (animation.id === "bloom-chip-slide") animation.cancel()
    if (!element.isConnected || !(duration > 0)) continue
    const now = element.getBoundingClientRect()
    const x = was.left - now.left
    const y = was.top - now.top
    if (Math.abs(x) < 0.5 && Math.abs(y) < 0.5) continue
    const slide = element.animate([{ translate: `${x}px ${y}px` }, { translate: "0 0" }], {
      duration,
      easing: style.getPropertyValue("--ease-smooth").trim() || "ease-out",
    })
    slide.id = "bloom-chip-slide"
  }
}

export type ChipLookProps = VariantProps<typeof badgeLook>

export interface ChipRootProps extends ChipLookProps {
  scope: string
  value: string
  remove: () => void
  children: JSX.Element
  class?: string | undefined
}

/**
 * A chip: a badge 36px tall, so a row of them fits the 48px field, with its words and its button. A press on its words
 * goes through to the field under it. It pops in as it is chosen, and shrinks and fades as it is taken out, both
 * transitions, so a change of mind turns it round from where it is; it holds still meanwhile (`bloom-hold`), and is
 * gone once that ends.
 */
export function ChipRoot(props: ChipRootProps): Element {
  const presence = useContext(ChipPresence)
  return (
    <ChipRemove value={() => props.remove()}>
      <span
        data-scope={props.scope}
        data-part="chip"
        data-value={props.value}
        data-state={presence?.present() === false ? "closed" : "open"}
        onAnimationEnd={(event) => {
          if (event.target === event.currentTarget && event.animationName === "bloom-hold") presence?.leave()
        }}
        class={badgeLook({ tone: props.tone, variant: props.variant, class: [chip(), props.class] })}
      >
        {props.children}
      </span>
    </ChipRemove>
  )
}

const chip = tv({
  base: [
    "pointer-events-none relative z-[1] min-h-9 min-w-0 gap-1 ps-3 pe-0.5 text-sm",
    "transition-[opacity,scale] duration-(--duration-pop) ease-pop",
    "group-data-settled/chips:starting:scale-(--pop-in-scale) group-data-settled/chips:starting:opacity-0",
    "data-[state=closed]:scale-(--pop-in-scale) data-[state=closed]:opacity-0 data-[state=closed]:animate-hold",
    "data-[state=closed]:duration-(--duration-exit) data-[state=closed]:ease-smooth",
  ],
})

export function ChipText(props: { scope: string; children: JSX.Element; class?: string | undefined }): Element {
  return (
    <span data-scope={props.scope} data-part="chip-text" class={text({ class: props.class })}>
      {props.children}
    </span>
  )
}

const text = tv({ base: "min-w-0 truncate" })

/**
 * The chip's cross, a 32px button in a 48px target that reaches past the chip into the gaps around it. It names itself
 * with its words, shown to assistive technology only. It is left out of the Tab order, so ten choices do not put ten
 * stops before the field: the keyboard takes a choice out in the list, and with Backspace in a combobox. It keeps the
 * focus where it was, and the field takes it once the choice is out.
 */
export function ChipTrigger(props: { scope: string; children: JSX.Element; class?: string | undefined }): Element {
  const remove = useContext(ChipRemove)
  return (
    <button
      type="button"
      tabindex="-1"
      data-scope={props.scope}
      data-part="chip-trigger"
      class={trigger({ class: props.class })}
      onPointerDown={(event) => event.preventDefault()}
      onClick={() => remove?.()}
    >
      <Mark class="size-5">
        <path d={cross} />
      </Mark>
      <span class="sr-only">{props.children}</span>
    </button>
  )
}

const trigger = tv({
  base: [
    "pointer-events-auto relative inline-flex size-8 shrink-0 pressable items-center justify-center rounded-[0.3rem]",
    "before:absolute before:-inset-2 before:content-['']",
    "motion-press hover:bg-current/12 pressing:bg-current/18 focus-ring [--focus-inset:3px]",
  ],
})

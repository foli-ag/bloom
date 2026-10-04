import { RadioGroup as Seed } from "@foliag/seeds/radio-group"
import type { JSX } from "@solidjs/web"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"
import { choiceRow } from "../internal/choice.js"

export type RootProps = Omit<Seed.RootProps, "class"> & {
  /** Merged after the component's own classes, and wins over them */
  class?: string | undefined
}

/**
 * One choice among a few, all in view at once: with more than six or so, use a Select. Arrow keys move the choice
 * inside the group, Tab leaves it. Name the group with a `Label`, and put each choice in an `Item`.
 *
 * @example
 * <RadioGroup.Root name="culture" defaultValue="ble">
 *   <RadioGroup.Label>Culture</RadioGroup.Label>
 *   <RadioGroup.Item value="ble">Blé</RadioGroup.Item>
 *   <RadioGroup.Item value="mais">Maïs</RadioGroup.Item>
 * </RadioGroup.Root>
 */
export function Root(props: RootProps): Element {
  return <Seed.Root {...omit(props, "class")} class={root({ class: props.class })} />
}

export type LabelProps = Omit<Seed.LabelProps, "class" | "children"> & {
  /** What the farmer is choosing. It is the group's accessible name, so there is no default. */
  children: JSX.Element
  class?: string | undefined
}

export function Label(props: LabelProps): Element {
  return <Seed.Label {...omit(props, "class")} class={label({ class: props.class })} />
}

export type ItemProps = Omit<Seed.ItemProps, "class" | "children"> & {
  /** The words next to the circle. They are the choice's accessible name. */
  children: JSX.Element
  class?: string | undefined
}

/**
 * A circle and its words as one row at least 48px tall: tapping anywhere on it chooses it. Stacked, each row is the
 * width of the group. Side by side, each is as wide as its words.
 */
export function Item(props: ItemProps): Element {
  const rest = omit(props, "class", "children")
  return (
    <Seed.Item {...rest} class={choiceRow({ class: props.class })}>
      <Seed.Item.Control class={control()} />
      <Seed.Item.Text>{props.children}</Seed.Item.Text>
      <Seed.Item.HiddenInput />
    </Seed.Item>
  )
}

const root = tv({
  base: "flex data-[orientation=horizontal]:flex-row data-[orientation=horizontal]:flex-wrap data-[orientation=horizontal]:gap-x-6 data-[orientation=vertical]:flex-col",
})

const label = tv({ base: "mb-1 block text-base font-semibold tracking-body text-ink data-disabled:text-disabled-ink" })

// The dot is the control's own pseudo-element, so the ring stays still while the dot springs in
const control = tv({
  base: [
    "grid size-7 shrink-0 place-items-center rounded-full border-2 border-strong bg-raised",
    "motion-touch group-hover/row:border-ink group-active/row:scale-(--press-scale-small)",
    "after:size-3 after:scale-0 after:rounded-full after:bg-on-primary after:transition-transform",
    "after:duration-(--duration-pop) after:ease-pop",
    "data-[state=checked]:border-primary-edge data-[state=checked]:bg-primary data-[state=checked]:after:scale-100",
    "data-focus-visible:outline-3 data-focus-visible:outline-offset-3 data-focus-visible:outline-focus",
    "data-invalid:border-danger-text data-invalid:shadow-[inset_0_0_0_1px_var(--color-danger-text)]",
    "data-disabled:border-disabled data-disabled:bg-disabled data-disabled:after:bg-disabled-ink",
  ],
})

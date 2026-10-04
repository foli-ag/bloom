import { Checkbox as Seed } from "@foliag/seeds/checkbox"
import type { JSX } from "@solidjs/web"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"
import { Mark, tick } from "../internal/icons.jsx"
import { choiceRow } from "../internal/choice.js"

export type CheckboxProps = Omit<Seed.RootProps, "children" | "class"> & {
  /** The words next to the box. They are the checkbox's accessible name, so there is no default and no way to omit them. */
  children: JSX.Element
  /** Merged after the component's own classes, and wins over them */
  class?: string | undefined
}

/**
 * A box and its words as one row, the width of its container and at least 48px tall: tapping anywhere on it ticks the
 * box. The box goes down with the finger and comes back up as it fills and the tick draws in, all on one clock.
 *
 * @example
 * <Checkbox name="irrigue" onCheckedChange={(details) => setIrrigated(details.checked === true)}>Irrigué</Checkbox>
 */
export function Checkbox(props: CheckboxProps): Element {
  const rest = omit(props, "children", "class")
  return (
    <Seed.Root {...rest} class={choiceRow({ class: props.class })}>
      <Seed.Control class={control()}>
        <Mark stroke-width={3.5} class="size-5">
          <path d={tick} pathLength="1" class={mark({ shown: "checked" })} />
          <path d="M6 12h12" pathLength="1" class={mark({ shown: "indeterminate" })} />
        </Mark>
      </Seed.Control>
      <Seed.Label>{props.children}</Seed.Label>
      <Seed.HiddenInput />
    </Seed.Root>
  )
}

// The box carries its state as data attributes from the checkbox machine. It is hidden from assistive technology, the
// native input is what they read.
const control = tv({
  base: [
    "grid size-7 shrink-0 place-items-center rounded-box border-2 border-strong bg-raised text-on-primary",
    "motion-touch group-hover/row:border-ink group-active/row:scale-(--press-scale-small)",
    "data-[state=checked]:border-primary-edge data-[state=checked]:bg-primary",
    "data-[state=indeterminate]:border-primary-edge data-[state=indeterminate]:bg-primary",
    "data-focus-visible:outline-3 data-focus-visible:outline-offset-3 data-focus-visible:outline-focus",
    "data-invalid:border-danger-text data-invalid:shadow-[inset_0_0_0_1px_var(--color-danger-text)]",
    "data-disabled:border-disabled data-disabled:bg-disabled data-disabled:text-disabled-ink",
  ],
})

// A mark is drawn by moving the dash along its path, which takes a repaint of a 20px glyph and no layout
const mark = tv({
  base: [
    "[stroke-dasharray:1] [stroke-dashoffset:1]",
    "transition-[stroke-dashoffset] duration-(--duration-smooth) ease-smooth",
  ],
  variants: {
    shown: {
      checked: "group-data-[state=checked]/row:[stroke-dashoffset:0]",
      indeterminate: "group-data-[state=indeterminate]/row:[stroke-dashoffset:0]",
    },
  },
})

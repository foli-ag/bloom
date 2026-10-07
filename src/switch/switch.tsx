import { Switch as Seed } from "@foliag/seeds/switch"
import type { JSX } from "@solidjs/web"
import { omit, type Element } from "solid-js"
import { tv } from "../internal/variants.js"
import { choiceRow, drawnMark } from "../internal/choice.js"
import { Mark, tick } from "../internal/icons.jsx"

export type SwitchProps = Omit<Seed.RootProps, "children" | "class"> & {
  /** The words before the switch. They are its accessible name, so there is no default and no way to omit them. */
  children: JSX.Element
  /** Merged after the component's own classes, and wins over them */
  class?: string | undefined
}

/**
 * A setting that is on or off, and applies at once. For a choice that waits for a "Save", use a Checkbox.
 *
 * The words come first and the switch sits at the end of the row, where a phone's own settings put it and a right thumb
 * rests. The whole row is the target, the width of its container and at least 48px tall. The knob slides across, its
 * track and its tick changing with it, so the state shows in its place and its mark as well as its color. Under reduced
 * motion the knob changes sides at once and only the colors fade.
 *
 * @example
 * <Switch defaultChecked onCheckedChange={(details) => setAuto(details.checked)}>Arrosage automatique</Switch>
 */
export function Switch(props: SwitchProps): Element {
  const rest = omit(props, "children", "class")
  return (
    <Seed.Root {...rest} class={choiceRow({ control: "trailing", class: props.class })}>
      <Seed.Label>{props.children}</Seed.Label>
      <Seed.Control class={control()}>
        <Seed.Thumb class={thumb()}>
          <Mark stroke-width={4} class="size-4">
            <path d={tick} pathLength="1" class={drawnMark({ shown: "checked" })} />
          </Mark>
        </Seed.Thumb>
      </Seed.Control>
      {/* A native checkbox says "checked" where a switch says "on", so the role is set */}
      <Seed.HiddenInput role="switch" />
    </Seed.Root>
  )
}

// The track is 56 by 32px with a 2px edge and the knob 24px, 2px clear of the edge all round, so it travels 24px. The
// track is hidden from assistive technology, the native input is what they read. Under the pointer an off track darkens
// its edge and an on one lightens, as a primary button does. A disabled switch is grey whatever its state, which the
// knob's place and its tick still show.
//
// The knob is dark on the green track rather than white, as white on that green is 2.5:1 and the knob's place is what
// says on or off: dark ink on it is 7.4:1, in the sun too.
const control = tv({
  base: [
    "flex h-8 w-14 shrink-0 items-center rounded-full border-2 border-strong bg-raised px-0.5",
    "transition-[color,background-color,border-color] duration-(--duration-smooth) ease-smooth group-hover/row:border-ink",
    "not-data-disabled:data-[state=checked]:border-primary-edge not-data-disabled:data-[state=checked]:bg-primary",
    "group-hover/row:not-data-disabled:not-data-readonly:data-[state=checked]:bg-primary-hover",
    "focus-ring data-invalid:[--color-focus:var(--color-danger-text)]",
    "data-invalid:border-danger-text data-invalid:shadow-[inset_0_0_0_1px_var(--color-danger-text)]",
    "data-disabled:border-disabled data-disabled:bg-disabled",
  ],
})

// The knob goes down with the finger in 90ms and comes back on the pop spring, as `motion-touch` has it, and crosses on
// `--duration-travel`: the smooth spring, or at once under reduced motion.
const thumb = tv({
  base: [
    "grid size-6 place-items-center rounded-full bg-strong text-primary [scale:var(--choice-press,1)]",
    "[transition:scale_var(--press-duration,var(--duration-pop))_var(--press-ease,var(--ease-pop)),translate_var(--duration-travel)_var(--ease-smooth),background-color_var(--duration-smooth)_var(--ease-smooth)]",
    "data-[state=checked]:translate-x-6 rtl:data-[state=checked]:-translate-x-6 not-data-disabled:data-[state=checked]:bg-on-primary",
    "data-disabled:bg-disabled-ink data-disabled:text-disabled",
  ],
})

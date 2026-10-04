import { Switch as Seed } from "@foliag/seeds/switch"
import type { JSX } from "@solidjs/web"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"
import { choiceRow } from "../internal/choice.js"
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
 * track and its tick changing with it, so the state shows in its place and its mark as well as its color.
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
            <path d={tick} pathLength="1" class={drawnTick()} />
          </Mark>
        </Seed.Thumb>
      </Seed.Control>
      {/* A native checkbox says "checked" where a switch says "on", so the role is set */}
      <Seed.HiddenInput role="switch" />
    </Seed.Root>
  )
}

// The track is 56 by 32px with a 2px edge and the knob 24px, 2px clear of the edge all round, so it travels 24px. The
// track is hidden from assistive technology, the native input is what they read.
const control = tv({
  base: [
    "flex h-8 w-14 shrink-0 items-center rounded-full border-2 border-strong bg-raised px-0.5",
    "transition-colors duration-(--duration-smooth) ease-smooth group-hover/row:border-ink",
    "data-[state=checked]:border-primary-edge data-[state=checked]:bg-primary",
    "data-focus-visible:outline-3 data-focus-visible:outline-offset-3 data-focus-visible:outline-focus",
    "data-invalid:border-danger-text data-invalid:shadow-[inset_0_0_0_1px_var(--color-danger-text)]",
    "data-disabled:border-disabled data-disabled:bg-disabled",
  ],
})

const thumb = tv({
  base: [
    "grid size-6 place-items-center rounded-full bg-strong text-primary",
    "motion-touch group-active/row:scale-(--press-scale-small)",
    "data-[state=checked]:translate-x-6 rtl:data-[state=checked]:-translate-x-6 data-[state=checked]:bg-on-primary",
    "data-disabled:bg-disabled-ink",
  ],
})

// The tick is drawn in as the knob arrives
const drawnTick = tv({
  base: [
    "[stroke-dasharray:1] [stroke-dashoffset:1]",
    "transition-[stroke-dashoffset] duration-(--duration-smooth) ease-smooth",
    "group-data-[state=checked]/row:[stroke-dashoffset:0]",
  ],
})

import { Combobox as Seed } from "@foliag/seeds/combobox"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"
import { fieldFrame } from "../internal/field.js"

export type ComboboxControlProps = Omit<Seed.ControlProps, "class"> & {
  class?: string | undefined
}

/**
 * The field, 48px tall: the `Input`, an `Indicator` at its end, and before them a `ChipGroup` when there are several
 * choices. The chips and the input share its lines and wrap together, and it grows a line at a time. A press anywhere
 * on it that is not on a button goes to the input, which opens the list. Its ring shows while the input has the focus.
 */
export function ComboboxControl(props: ComboboxControlProps): Element {
  return (
    <Seed.Control
      {...omit(props, "class", "onClick")}
      onClick={(event: MouseEvent) => {
        const own = (props as { onClick?: unknown }).onClick
        if (typeof own === "function") own(event)
        const target = event.target as HTMLElement
        if (event.defaultPrevented || target.closest("input, button")) return
        const input = (event.currentTarget as HTMLElement).querySelector("input")
        input?.focus()
        input?.click()
      }}
      class={fieldFrame({ class: [control(), props.class] })}
    />
  )
}

// Room at the end for the chevron
const control = tv({
  base: "group/control relative cursor-text flex-wrap items-center gap-2 p-1 pe-12 data-[state=open]:border-ink",
})

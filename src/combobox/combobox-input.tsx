import { Combobox as Seed, useComboboxContext } from "@foliag/seeds/combobox"
import { omit, untrack, type Element } from "solid-js"
import { tv } from "tailwind-variants"
import { fieldFrameInput } from "../internal/field.js"
import { forwardRef } from "../internal/pointer.js"

export type ComboboxInputProps = Omit<Seed.InputProps, "class"> & {
  class?: string | undefined
}

/**
 * Where the farmer types, inside the `Control`, which draws its edge and its ring. The arrow keys move through the list
 * while focus stays here, and Enter chooses. With chips, Backspace in the empty input takes the last choice out.
 */
export function ComboboxInput(props: ComboboxInputProps): Element {
  const api = useComboboxContext()
  const rest = omit(props, "class", "ref")
  return (
    <Seed.Input
      {...rest}
      ref={(input: HTMLInputElement) => {
        input.addEventListener("keydown", (event) => {
          if (event.key !== "Backspace" || event.defaultPrevented || input.value !== "") return
          const { multiple, value } = api()
          const last = value.at(-1)
          if (!multiple || last === undefined || !input.parentElement?.querySelector("[data-part=chip]")) return
          event.preventDefault()
          api().clearValue(last)
        })
        forwardRef(
          untrack(() => props.ref),
          input,
        )
      }}
      class={fieldFrameInput({ class: [input(), props.class] })}
    />
  )
}

// A line of the field, as tall as a chip, and at least a few letters wide before it wraps under the chips
const input = tv({ base: "min-h-9 basis-24 px-3 py-0" })

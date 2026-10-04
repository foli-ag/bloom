import { NumberInput as Seed } from "@foliag/seeds/number-input"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"
import { fieldBox } from "../internal/field.js"

export type NumberInputInputProps = Omit<Seed.InputProps, "class"> & {
  class?: string | undefined
}

/** The field, its digits centered and of even width, so the number does not shift as it steps */
export function NumberInputInput(props: NumberInputInputProps): Element {
  return <Seed.Input {...omit(props, "class")} class={fieldBox({ class: [input(), props.class] })} />
}

const input = tv({ base: "min-w-0 flex-1 px-4 py-2 text-center tabular-nums" })

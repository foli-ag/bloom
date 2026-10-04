import { PinInput as Seed } from "@foliag/seeds/pin-input"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"
import { fieldBox } from "../internal/field.js"

export type PinInputInputProps = Omit<Seed.InputProps, "class"> & {
  class?: string | undefined
}

/** One box, 48px wide and 56px tall, its character large and centered */
export function PinInputInput(props: PinInputInputProps): Element {
  return <Seed.Input {...omit(props, "class")} class={fieldBox({ size: "lg", class: [input(), props.class] })} />
}

const input = tv({
  base: "h-14 w-12 shrink-0 p-0 text-center text-xl font-semibold tabular-nums placeholder:text-muted",
})

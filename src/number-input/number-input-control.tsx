import { NumberInput as Seed } from "@foliag/seeds/number-input"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"

export type NumberInputControlProps = Omit<Seed.ControlProps, "class"> & {
  class?: string | undefined
}

/** A row holding the field between its two buttons, each at the thumb's 48px */
export function NumberInputControl(props: NumberInputControlProps): Element {
  return <Seed.Control {...omit(props, "class")} class={control({ class: props.class })} />
}

const control = tv({ base: "flex items-stretch gap-2" })

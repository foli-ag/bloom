import { NumberInput as Seed } from "@foliag/seeds/number-input"
import type { JSX } from "@solidjs/web"
import { omit, type Element } from "solid-js"
import { fieldLabel } from "../internal/field.js"

export type NumberInputLabelProps = Omit<Seed.LabelProps, "class" | "children"> & {
  /** What the number is, with its unit. It is the field's accessible name, so it is required. */
  children: JSX.Element
  class?: string | undefined
}

export function NumberInputLabel(props: NumberInputLabelProps): Element {
  return <Seed.Label {...omit(props, "class")} class={fieldLabel({ class: props.class })} />
}

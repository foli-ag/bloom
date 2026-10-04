import { Combobox as Seed } from "@foliag/seeds/combobox"
import type { JSX } from "@solidjs/web"
import { omit, type Element } from "solid-js"
import { fieldLabel } from "../internal/field.js"

export type ComboboxLabelProps = Omit<Seed.LabelProps, "class" | "children"> & {
  /** What is looked for, such as "Commune". It names the field, so it is required. */
  children: JSX.Element
  class?: string | undefined
}

export function ComboboxLabel(props: ComboboxLabelProps): Element {
  return <Seed.Label {...omit(props, "class")} class={fieldLabel({ class: props.class })} />
}

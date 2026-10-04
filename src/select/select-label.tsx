import { Select as Seed } from "@foliag/seeds/select"
import type { JSX } from "@solidjs/web"
import { omit, type Element } from "solid-js"
import { fieldLabel } from "../internal/field.js"

export type SelectLabelProps = Omit<Seed.LabelProps, "class" | "children"> & {
  /** What is chosen, such as "Culture". It names the field, so it is required. */
  children: JSX.Element
  class?: string | undefined
}

export function SelectLabel(props: SelectLabelProps): Element {
  return <Seed.Label {...omit(props, "class")} class={fieldLabel({ class: props.class })} />
}

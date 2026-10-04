import { Editable as Seed } from "@foliag/seeds/editable"
import type { JSX } from "@solidjs/web"
import { omit, type Element } from "solid-js"
import { fieldLabel } from "../internal/field.js"

export type EditableLabelProps = Omit<Seed.LabelProps, "class" | "children"> & {
  /** What the value is. It names the field, so it is required. */
  children: JSX.Element
  class?: string | undefined
}

export function EditableLabel(props: EditableLabelProps): Element {
  return <Seed.Label {...omit(props, "class")} class={fieldLabel({ class: props.class })} />
}

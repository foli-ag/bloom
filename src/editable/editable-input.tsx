import { Editable as Seed } from "@foliag/seeds/editable"
import { omit, type Element } from "solid-js"
import { fieldBox } from "../internal/field.js"

export type EditableInputProps = Omit<Seed.InputProps, "class"> & {
  class?: string | undefined
}

/** The field the value is typed into while it is being changed, 48px tall like an input */
export function EditableInput(props: EditableInputProps): Element {
  return <Seed.Input {...omit(props, "class")} class={fieldBox({ class: ["px-4 py-2", props.class] })} />
}

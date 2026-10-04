import { Editable as Seed } from "@foliag/seeds/editable"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"
import { fieldFrameInput } from "../internal/field.js"

export type EditableInputProps = Omit<Seed.InputProps, "class"> & {
  class?: string | undefined
}

/**
 * The field the value is typed into while it is being changed. The `Area` is its box, so its text sits exactly where the
 * preview's did, and the box firms up around it.
 */
export function EditableInput(props: EditableInputProps): Element {
  return <Seed.Input {...omit(props, "class")} class={fieldFrameInput({ class: [input(), props.class] })} />
}

const input = tv({ base: "col-start-1 row-start-1" })

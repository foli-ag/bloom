import { Editable as Seed } from "@foliag/seeds/editable"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"

export type EditableControlProps = Omit<Seed.ControlProps, "class"> & {
  class?: string | undefined
}

/** A row for the triggers. Zag shows `Trigger.Edit` outside edit mode and the other two inside it. */
export function EditableControl(props: EditableControlProps): Element {
  return <Seed.Control {...omit(props, "class")} class={control({ class: props.class })} />
}

const control = tv({ base: "flex flex-wrap gap-3" })

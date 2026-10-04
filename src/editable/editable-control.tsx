import { Editable as Seed } from "@foliag/seeds/editable"
import { omit, type Element } from "solid-js"
import { tv } from "../internal/variants.js"

export type EditableControlProps = Omit<Seed.ControlProps, "class"> & {
  class?: string | undefined
}

/**
 * The end of the `Area`'s box, holding its buttons: zag shows `Trigger.Edit` outside edit mode and the other two inside
 * it. It reaches over the box's edge, so each button keeps a full 48px in a 48px box.
 */
export function EditableControl(props: EditableControlProps): Element {
  return <Seed.Control {...omit(props, "class")} class={control({ class: props.class })} />
}

// At the top of the box, so a name that wraps onto a second line leaves its buttons the height of one
const control = tv({ base: "col-start-2 row-start-1 -my-0.5 -me-0.5 flex h-12 shrink-0 items-stretch self-start" })

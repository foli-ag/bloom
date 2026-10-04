import { Editable as Seed } from "@foliag/seeds/editable"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"

export type EditableAreaProps = Omit<Seed.AreaProps, "class"> & {
  class?: string | undefined
}

/** Holds the preview and the field in the same place, so the page does not move as one turns into the other */
export function EditableArea(props: EditableAreaProps): Element {
  return <Seed.Area {...omit(props, "class")} class={area({ class: props.class })} />
}

const area = tv({ base: "grid min-w-0" })

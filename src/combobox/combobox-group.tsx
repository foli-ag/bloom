import { Combobox as Seed } from "@foliag/seeds/combobox"
import { omit, type Element } from "solid-js"

export type ComboboxGroupProps = Omit<Seed.GroupProps, "class"> & {
  class?: string | undefined
}

/** Items under a `Group.Label`. It has no look of its own. */
export function ComboboxGroup(props: ComboboxGroupProps): Element {
  return <Seed.Group {...omit(props, "class")} class={props.class} />
}

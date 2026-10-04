import { Editable as Seed } from "@foliag/seeds/editable"
import { omit, type Element } from "solid-js"
import { fieldRoot } from "../internal/field.js"

export type EditableRootProviderProps = Omit<Seed.RootProviderProps, "class"> & {
  class?: string | undefined
}

/** A root for a machine made with bloom's `useEditable`, whose state the app then reads and sets from outside it */
export function EditableRootProvider(props: EditableRootProviderProps): Element {
  return <Seed.RootProvider {...omit(props, "class")} class={fieldRoot({ class: props.class })} />
}

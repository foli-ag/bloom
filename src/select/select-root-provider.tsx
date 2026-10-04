import { Select as Seed } from "@foliag/seeds/select"
import { omit, type Element } from "solid-js"
import { fieldRoot } from "../internal/field.js"

export type SelectRootProviderProps = Omit<Seed.RootProviderProps, "as" | "class" | "lazyMount" | "unmountOnExit"> & {
  class?: string | undefined
}

/** A root for a select made with bloom's `useSelect`, whose state the app then reads and sets from outside it */
export function SelectRootProvider(props: SelectRootProviderProps): Element {
  return (
    <Seed.RootProvider {...omit(props, "class")} lazyMount unmountOnExit class={fieldRoot({ class: props.class })} />
  )
}

import { NumberInput as Seed } from "@foliag/seeds/number-input"
import { omit, type Element } from "solid-js"
import { fieldRoot } from "../internal/field.js"

export type NumberInputRootProviderProps = Omit<Seed.RootProviderProps, "class"> & {
  class?: string | undefined
}

/** A root for a number input made with `useNumberInput`, whose state the app then reads and sets from outside it. It looks like `Root`. */
export function NumberInputRootProvider(props: NumberInputRootProviderProps): Element {
  return <Seed.RootProvider {...omit(props, "class")} class={fieldRoot({ class: props.class })} />
}

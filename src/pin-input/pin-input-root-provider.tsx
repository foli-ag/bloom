import { PinInput as Seed } from "@foliag/seeds/pin-input"
import { omit, type Element } from "solid-js"
import { fieldRoot } from "../internal/field.js"

export type PinInputRootProviderProps = Omit<Seed.RootProviderProps, "class"> & {
  class?: string | undefined
}

/** A root for a code input made with `usePinInput`, whose state the app then reads and sets from outside it. It looks like `Root`. */
export function PinInputRootProvider(props: PinInputRootProviderProps): Element {
  return <Seed.RootProvider {...omit(props, "class")} class={fieldRoot({ class: props.class })} />
}

import { PasswordInput as Seed } from "@foliag/seeds/password-input"
import { omit, type Element } from "solid-js"
import { fieldRoot } from "../internal/field.js"

export type PasswordInputRootProviderProps = Omit<Seed.RootProviderProps, "class"> & {
  class?: string | undefined
}

/** A root for a password input made with `usePasswordInput`, whose state the app then reads and sets from outside it. It looks like `Root`. */
export function PasswordInputRootProvider(props: PasswordInputRootProviderProps): Element {
  return <Seed.RootProvider {...omit(props, "class")} class={fieldRoot({ class: props.class })} />
}

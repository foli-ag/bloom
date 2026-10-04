import { PasswordInput as Seed } from "@foliag/seeds/password-input"
import type { JSX } from "@solidjs/web"
import { omit, type Element } from "solid-js"
import { fieldLabel } from "../internal/field.js"

export type PasswordInputLabelProps = Omit<Seed.LabelProps, "class" | "children"> & {
  /** Such as "Mot de passe". It is the field's accessible name, so it is required. */
  children: JSX.Element
  class?: string | undefined
}

export function PasswordInputLabel(props: PasswordInputLabelProps): Element {
  return <Seed.Label {...omit(props, "class")} class={fieldLabel({ class: props.class })} />
}

import { PasswordInput as Seed } from "@foliag/seeds/password-input"
import { omit, type Element } from "solid-js"
import { tv } from "../internal/variants.js"

export type PasswordInputControlProps = Omit<Seed.ControlProps, "class"> & {
  class?: string | undefined
}

/** A row holding the field and, after it, the button that shows the password */
export function PasswordInputControl(props: PasswordInputControlProps): Element {
  return <Seed.Control {...omit(props, "class")} class={control({ class: props.class })} />
}

const control = tv({ base: "flex items-stretch gap-2" })

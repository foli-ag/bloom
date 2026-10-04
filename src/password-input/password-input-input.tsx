import { PasswordInput as Seed } from "@foliag/seeds/password-input"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"
import { fieldBox } from "../internal/field.js"

export type PasswordInputInputProps = Omit<Seed.InputProps, "class"> & {
  class?: string | undefined
}

/** The field, 48px tall like an input. It takes the room the button leaves. */
export function PasswordInputInput(props: PasswordInputInputProps): Element {
  return <Seed.Input {...omit(props, "class")} class={fieldBox({ class: [input(), props.class] })} />
}

const input = tv({ base: "min-w-0 flex-1 px-4 py-2" })

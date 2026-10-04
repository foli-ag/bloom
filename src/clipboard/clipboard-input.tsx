import { Clipboard as Seed } from "@foliag/seeds/clipboard"
import { omit, type Element } from "solid-js"
import { tv } from "../internal/variants.js"
import { fieldBox } from "../internal/field.js"

export type ClipboardInputProps = Omit<Seed.InputProps, "class"> & {
  class?: string | undefined
}

/**
 * The value, read-only. Focus selects all of it, and copying from it counts as a copy. Its box is the field's, on the
 * page's own ground, as nothing can be typed into it.
 */
export function ClipboardInput(props: ClipboardInputProps): Element {
  return <Seed.Input {...omit(props, "class")} class={fieldBox({ class: [input(), props.class] })} />
}

const input = tv({ base: "min-w-0 truncate bg-surface px-4 py-2 hover:border-strong" })

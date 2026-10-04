import { Clipboard as Seed } from "@foliag/seeds/clipboard"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"

export type ClipboardValueTextProps = Omit<Seed.ValueTextProps, "class"> & {
  class?: string | undefined
}

/** The value as text, for a value too short to need a field, such as a code. A long one wraps anywhere. */
export function ClipboardValueText(props: ClipboardValueTextProps): Element {
  return <Seed.ValueText {...omit(props, "class")} class={valueText({ class: props.class })} />
}

const valueText = tv({ base: "text-base font-semibold tracking-body break-all text-ink" })

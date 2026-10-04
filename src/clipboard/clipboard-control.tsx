import { Clipboard as Seed } from "@foliag/seeds/clipboard"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"

export type ClipboardControlProps = Omit<Seed.ControlProps, "class"> & {
  class?: string | undefined
}

/** A row holding the value and the button. Under 360px the button drops below at full width. */
export function ClipboardControl(props: ClipboardControlProps): Element {
  return <Seed.Control {...omit(props, "class")} class={control({ class: props.class })} />
}

const control = tv({
  base: "flex flex-wrap items-stretch gap-2 *:data-[part=input]:min-w-48 *:data-[part=input]:flex-1",
})

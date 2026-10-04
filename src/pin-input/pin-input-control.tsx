import { PinInput as Seed } from "@foliag/seeds/pin-input"
import { omit, type Element } from "solid-js"
import { tv } from "../internal/variants.js"

export type PinInputControlProps = Omit<Seed.ControlProps, "class"> & {
  class?: string | undefined
}

/** The row of boxes, close enough to read as one code and far enough apart for a thumb */
export function PinInputControl(props: PinInputControlProps): Element {
  return <Seed.Control {...omit(props, "class")} class={control({ class: props.class })} />
}

const control = tv({ base: "flex gap-2" })

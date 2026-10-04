import { PinInput as Seed } from "@foliag/seeds/pin-input"
import type { JSX } from "@solidjs/web"
import { omit, type Element } from "solid-js"
import { fieldLabel } from "../internal/field.js"

export type PinInputLabelProps = Omit<Seed.LabelProps, "class" | "children"> & {
  /** What the code is, such as "Code reçu par SMS" */
  children: JSX.Element
  class?: string | undefined
}

export function PinInputLabel(props: PinInputLabelProps): Element {
  return <Seed.Label {...omit(props, "class")} class={fieldLabel({ class: props.class })} />
}

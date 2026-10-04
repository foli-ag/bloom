import { AngleSlider as Seed } from "@foliag/seeds/angle-slider"
import type { JSX } from "@solidjs/web"
import { omit, type Element } from "solid-js"
import { fieldLabel } from "../internal/field.js"

export type AngleSliderLabelProps = Omit<Seed.LabelProps, "class" | "children"> & {
  /** What the angle is, such as "Direction du vent". It is the dial's accessible name, so it is required. */
  children: JSX.Element
  class?: string | undefined
}

/** The dial's name. A press on it moves focus to the needle. */
export function AngleSliderLabel(props: AngleSliderLabelProps): Element {
  return <Seed.Label {...omit(props, "class")} class={fieldLabel({ class: props.class })} />
}

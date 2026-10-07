import { Progress as Seed } from "@foliag/seeds/progress"
import type { JSX } from "@solidjs/web"
import { omit, type Element } from "solid-js"
import { fieldLabel } from "../internal/field.js"

export type ProgressLabelProps = Omit<Seed.LabelProps, "class" | "children"> & {
  /** What is under way. It names the bar, so it is required. */
  children: JSX.Element
  class?: string | undefined
}

export function ProgressLabel(props: ProgressLabelProps): Element {
  return <Seed.Label {...omit(props, "class")} class={fieldLabel({ class: props.class })} />
}

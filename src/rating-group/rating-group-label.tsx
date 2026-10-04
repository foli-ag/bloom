import { RatingGroup as Seed } from "@foliag/seeds/rating-group"
import type { JSX } from "@solidjs/web"
import { omit, type Element } from "solid-js"
import { fieldLabel } from "../internal/field.js"

export type RatingGroupLabelProps = Omit<Seed.LabelProps, "class" | "children"> & {
  /** What is rated. It names the group of stars, so it is required. */
  children: JSX.Element
  class?: string | undefined
}

/** Names the stars. A tap on it moves focus to the mark given, or to the first star. */
export function RatingGroupLabel(props: RatingGroupLabelProps): Element {
  return <Seed.Label {...omit(props, "class")} class={fieldLabel({ class: props.class })} />
}

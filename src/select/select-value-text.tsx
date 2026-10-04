import { Select as Seed } from "@foliag/seeds/select"
import { omit, type Element } from "solid-js"
import { tv } from "../internal/variants.js"

export type SelectValueTextProps = Omit<Seed.ValueTextProps, "class"> & {
  class?: string | undefined
}

/**
 * The chosen labels, cut short with an ellipsis when they do not fit, or the `placeholder` while nothing is chosen.
 * Where chips show the choices, it is read by a screen reader only, which hears the field's value from it.
 */
export function SelectValueText(props: SelectValueTextProps): Element {
  return <Seed.ValueText {...omit(props, "class")} class={valueText({ class: props.class })} />
}

const valueText = tv({ base: "min-w-0 truncate group-has-[[data-part=chip]]/control:sr-only" })

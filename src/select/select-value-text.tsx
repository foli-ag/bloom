import { Select as Seed } from "@foliag/seeds/select"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"

export type SelectValueTextProps = Omit<Seed.ValueTextProps, "class"> & {
  class?: string | undefined
}

/** The chosen labels, cut short with an ellipsis when they do not fit, or the `placeholder` while nothing is chosen */
export function SelectValueText(props: SelectValueTextProps): Element {
  return <Seed.ValueText {...omit(props, "class")} class={valueText({ class: props.class })} />
}

const valueText = tv({ base: "min-w-0 truncate" })

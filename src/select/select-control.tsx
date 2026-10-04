import { Select as Seed } from "@foliag/seeds/select"
import { omit, type Element } from "solid-js"
import { tv } from "../internal/variants.js"
import { fieldFrame } from "../internal/field.js"

export type SelectControlProps = Omit<Seed.ControlProps, "class"> & {
  class?: string | undefined
}

/**
 * The field for several choices shown as chips: a `ChipGroup`, then the `Trigger`. The chips wrap onto as many lines as
 * they need, and the trigger lies under all of the field, so a press anywhere on it, on a chip's words too, opens the
 * list, and only a chip's cross takes a choice out. The field is 48px tall with one line, and grows a line at a time.
 */
export function SelectControl(props: SelectControlProps): Element {
  return <Seed.Control {...omit(props, "class")} class={fieldFrame({ class: [control(), props.class] })} />
}

// Room at the end for the chevron, which the trigger draws there
const control = tv({
  base: "group/control relative flex-wrap items-center gap-2 p-1 pe-12 data-[state=open]:border-ink",
})

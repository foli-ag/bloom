import { Select as Seed } from "@foliag/seeds/select"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"
import { fieldBox } from "../internal/field.js"

export type SelectTriggerProps = Omit<Seed.TriggerProps, "class"> & {
  class?: string | undefined
}

/**
 * The field, 48px tall like an input, holding a `ValueText` and an `Indicator`. It is dimmed while nothing is chosen.
 * The keyboard opens it with the arrow keys, and typing a letter picks the next item that starts with it.
 */
export function SelectTrigger(props: SelectTriggerProps): Element {
  return <Seed.Trigger {...omit(props, "class")} class={fieldBox({ class: [trigger(), props.class] })} />
}

const trigger = tv({
  base: "flex pressable items-center justify-between gap-3 px-4 py-2 text-start data-placeholder-shown:text-muted",
})

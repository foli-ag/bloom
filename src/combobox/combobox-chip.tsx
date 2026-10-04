import { useComboboxContext } from "@foliag/seeds/combobox"
import type { JSX } from "@solidjs/web"
import type { Element } from "solid-js"
import { ChipRoot, type ChipLookProps } from "../internal/chips.jsx"

export type ComboboxChipProps<T = any> = ChipLookProps & {
  /** The chosen item it shows */
  item: T
  /** A `Chip.Text` and a `Chip.Trigger` */
  children: JSX.Element
  class?: string | undefined
}

/**
 * A choice as a badge in the field, neutral and soft unless `tone` and `variant` say otherwise, as a `Badge` takes them.
 * Its `Chip.Trigger` takes the choice out and hands focus to the input.
 */
export function ComboboxChip<T = any>(props: ComboboxChipProps<T>): Element {
  const api = useComboboxContext()
  const value = () => api().collection.getItemValue(props.item) ?? ""
  return (
    <ChipRoot
      scope="combobox"
      value={value()}
      tone={props.tone}
      variant={props.variant}
      class={props.class}
      remove={() => {
        api().clearValue(value())
        api().focus()
      }}
    >
      {props.children}
    </ChipRoot>
  )
}

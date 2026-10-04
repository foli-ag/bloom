import type { ValidComponent } from "@foliag/seeds/polymorphic"
import { Editable as Seed } from "@foliag/seeds/editable"
import type { JSX } from "@solidjs/web"
import { omit, type Element } from "solid-js"
import { Mark } from "../internal/icons.jsx"
import { editableTrigger, editableTriggerMark } from "./editable-trigger-part.jsx"

export type EditableTriggerCancelProps<As extends ValidComponent = "button"> = Omit<
  Seed.Trigger.CancelProps<As>,
  "class" | "children"
> & {
  /** What a press does, such as "Annuler". They name the cross for a screen reader. */
  children: JSX.Element
  class?: string | undefined
}

/**
 * Puts the value back as it was, from a cross at the very end of the field. Escape does the same, and on a phone, whose
 * keyboard has no Escape, this is the way back.
 */
export function EditableTriggerCancel<As extends ValidComponent = "button">(
  props: EditableTriggerCancelProps<As>,
): Element {
  const own = props as EditableTriggerCancelProps
  return (
    <Seed.Trigger.Cancel
      {...omit(own, "class", "children")}
      class={editableTrigger({ tone: "cancel", class: own.class })}
    >
      <Mark class={editableTriggerMark}>
        <path d="M6 6l12 12M18 6 6 18" />
      </Mark>
      <span class="sr-only">{own.children}</span>
    </Seed.Trigger.Cancel>
  )
}

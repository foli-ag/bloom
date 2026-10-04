import type { ValidComponent } from "@foliag/seeds/polymorphic"
import { Editable as Seed } from "@foliag/seeds/editable"
import type { JSX } from "@solidjs/web"
import { omit, type Element } from "solid-js"
import { Mark, tick } from "../internal/icons.jsx"
import { editableTrigger, editableTriggerMark } from "./editable-trigger-part.jsx"

export type EditableTriggerSubmitProps<As extends ValidComponent = "button"> = Omit<
  Seed.Trigger.SubmitProps<As>,
  "class" | "children"
> & {
  /** What a press does, such as "Enregistrer". They name the tick for a screen reader. */
  children: JSX.Element
  class?: string | undefined
}

/**
 * Keeps the change, from a tick on the green of the main action at the end of the field. Enter keeps it too, and so does a
 * press outside the field unless `submitMode` says otherwise.
 */
export function EditableTriggerSubmit<As extends ValidComponent = "button">(
  props: EditableTriggerSubmitProps<As>,
): Element {
  const own = props as EditableTriggerSubmitProps
  return (
    <Seed.Trigger.Submit
      {...omit(own, "class", "children")}
      class={editableTrigger({ tone: "submit", class: own.class })}
    >
      <Mark class={editableTriggerMark}>
        <path d={tick} />
      </Mark>
      <span class="sr-only">{own.children}</span>
    </Seed.Trigger.Submit>
  )
}

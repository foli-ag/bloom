import type { ValidComponent } from "@foliag/seeds/polymorphic"
import { Editable as Seed } from "@foliag/seeds/editable"
import type { JSX } from "@solidjs/web"
import { omit, type Element } from "solid-js"
import { Mark } from "../internal/icons.jsx"
import { editableTrigger, editableTriggerMark } from "./editable-trigger-part.jsx"

export type EditableTriggerEditProps<As extends ValidComponent = "button"> = Omit<
  Seed.Trigger.EditProps<As>,
  "class" | "children"
> & {
  /** What a press does, such as "Renommer". Shown after the pencil; wrap them in `sr-only` for a pencil alone. */
  children: JSX.Element
  class?: string | undefined
}

/**
 * Turns the value into a field, from a pencil in the box beside the words, there without a hover so a phone shows it too.
 * Its words follow the pencil. Focus comes back to it once the change is kept or put back.
 */
export function EditableTriggerEdit<As extends ValidComponent = "button">(
  props: EditableTriggerEditProps<As>,
): Element {
  const own = props as EditableTriggerEditProps
  return (
    <Seed.Trigger.Edit {...omit(own, "class", "children")} class={editableTrigger({ tone: "edit", class: own.class })}>
      <Mark class={editableTriggerMark}>
        <path d={pencil} />
        <path d="m13.5 6.5 4 4" />
      </Mark>
      <span>{own.children}</span>
    </Seed.Trigger.Edit>
  )
}

const pencil = "M4 20h4L18.5 9.5a2.8 2.8 0 0 0-4-4L4 16v4Z"

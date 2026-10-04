import { Editable as Seed } from "@foliag/seeds/editable"
import { omit, type Element } from "solid-js"
import { fieldRoot } from "../internal/field.js"
import { translations } from "./use-editable.js"

export type EditableRootProps = Omit<Seed.RootProps, "class" | "translations"> & {
  /** Merged after the component's own classes, and wins over them */
  class?: string | undefined
}

/**
 * A value read as text that the farmer changes in place, such as the name of a parcel. A press on the words, or on the
 * pencil beside them, turns them into a field. Enter or the tick keeps the change, Escape or the cross puts the old
 * value back, and a press elsewhere keeps it.
 *
 * Text that turns into a field is easy to miss, so the `Area` draws a quiet box round the words with a pencil at its end,
 * `Trigger.Edit`, seen without a hover. The `Control` goes inside the `Area`, where its buttons are drawn: the pencil
 * with its words, then a tick and a cross named by theirs. They are the editable's own, so do not render them as a
 * `Button`.
 *
 * @example
 * <Editable.Root name="parcelle" defaultValue="Les Grands Champs" placeholder="Nom de la parcelle">
 *   <Editable.Label>Nom de la parcelle</Editable.Label>
 *   <Editable.Area>
 *     <Editable.Input />
 *     <Editable.Preview />
 *     <Editable.Control>
 *       <Editable.Trigger.Edit>Renommer</Editable.Trigger.Edit>
 *       <Editable.Trigger.Submit>Enregistrer</Editable.Trigger.Submit>
 *       <Editable.Trigger.Cancel>Annuler</Editable.Trigger.Cancel>
 *     </Editable.Control>
 *   </Editable.Area>
 * </Editable.Root>
 */
export function EditableRoot(props: EditableRootProps): Element {
  return <Seed.Root {...omit(props, "class")} translations={translations} class={fieldRoot({ class: props.class })} />
}

import { Editable as Seed } from "@foliag/seeds/editable"
import { omit, type Element } from "solid-js"
import { fieldRoot } from "../internal/field.js"
import { translations } from "./use-editable.js"

export type EditableRootProps = Omit<Seed.RootProps, "class" | "translations"> & {
  /** Merged after the component's own classes, and wins over them */
  class?: string | undefined
}

/**
 * A value read as text that the farmer changes in place, such as the name of a parcel. A tap on the text, or focus on
 * it, turns it into a field. Enter or a tap elsewhere keeps the change, Escape puts the old value back.
 *
 * Text that turns into a field is easy to miss, so always give it a visible `Trigger.Edit` with words. Its parts stack
 * with even gaps. The triggers are seeds' own, with no look: render them as a `Button`.
 *
 * @example
 * <Editable.Root name="parcelle" defaultValue="Les Grands Champs" placeholder="Nom de la parcelle">
 *   <Editable.Label>Nom de la parcelle</Editable.Label>
 *   <Editable.Area>
 *     <Editable.Input />
 *     <Editable.Preview />
 *   </Editable.Area>
 *   <Editable.Control>
 *     <Editable.Trigger.Edit as={Button} variant="outline">Renommer</Editable.Trigger.Edit>
 *     <Editable.Trigger.Submit as={Button}>Enregistrer</Editable.Trigger.Submit>
 *     <Editable.Trigger.Cancel as={Button} tone="neutral" variant="outline">Annuler</Editable.Trigger.Cancel>
 *   </Editable.Control>
 * </Editable.Root>
 */
export function EditableRoot(props: EditableRootProps): Element {
  return <Seed.Root {...omit(props, "class")} translations={translations} class={fieldRoot({ class: props.class })} />
}

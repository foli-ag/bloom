import { Dialog as Seed } from "@foliag/seeds/dialog"
import type { Element } from "solid-js"

export type DialogRootProps = Omit<Seed.RootProps, "lazyMount" | "unmountOnExit">

/**
 * A question or a short task that has to be dealt with before going back to the page. On a phone it rises from the
 * bottom as a sheet, with its buttons under the thumb; from 640px it is a card in the middle of the screen. Focus
 * moves into it and stays there, and the page behind neither scrolls nor reads out. Its parts mount when it opens and
 * leave once it has closed.
 *
 * `role="alertdialog"` is for a question that interrupts, such as confirming a deletion. A tap on the dim then does
 * not close it, so a stray tap cannot answer it, and focus starts on its `Trigger.Close`. Escape still closes it.
 *
 * @example
 * <Dialog.Root role="alertdialog">
 *   <Dialog.Trigger as={Button} tone="danger" variant="outline">Supprimer la parcelle</Dialog.Trigger>
 *   <Dialog.Backdrop />
 *   <Dialog.Positioner>
 *     <Dialog.Content>
 *       <Dialog.Title>Supprimer « Les Grands Champs » ?</Dialog.Title>
 *       <Dialog.Description>Ses 14 interventions seront supprimées aussi.</Dialog.Description>
 *       <Dialog.Actions>
 *         <Dialog.Trigger.Close as={Button} tone="neutral" variant="outline">Annuler</Dialog.Trigger.Close>
 *         <Button tone="danger" onClick={remove}>Supprimer</Button>
 *       </Dialog.Actions>
 *     </Dialog.Content>
 *   </Dialog.Positioner>
 * </Dialog.Root>
 */
export function DialogRoot(props: DialogRootProps): Element {
  return <Seed.Root {...props} lazyMount unmountOnExit />
}

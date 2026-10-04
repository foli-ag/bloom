import { Drawer as Seed } from "@foliag/seeds/drawer"
import { omit, type Element } from "solid-js"
import { DialogLookContext, lookOf, type DialogPhone, type DialogSize } from "./dialog-look.js"
import { closesOnInteractOutside, type SwipeProp } from "./use-dialog.js"

export type DialogRootProps = Omit<Seed.RootProps, "lazyMount" | "unmountOnExit" | SwipeProp> & {
  /**
   * How wide the card is from 640px: `sm` (28rem) for a question, `md` (32rem, the default) for a short form, `lg`
   * (48rem) for a table or a long text. On a phone it is the width of the screen whatever its size.
   */
  size?: DialogSize | undefined
  /**
   * What it is on a phone: a sheet from the bottom edge (`sheet`, the default), or the whole screen (`full-screen`), for
   * a long form that would be cramped in a sheet. A full-screen dialog slides up from the bottom edge as the sheet does,
   * clears the notch and the home indicator, and keeps its `Actions` at the foot of the screen. From 640px it is a card.
   */
  phone?: DialogPhone | undefined
}

/**
 * A question or a short task that has to be dealt with before going back to the page. On a phone it rises from the
 * bottom as a sheet, with its buttons under the thumb, and a swipe down on the grabber along its top closes it, as on
 * a `Drawer`; from 640px it is a card in the middle of the screen. Focus moves into it and stays there, and the page
 * behind neither scrolls nor reads out. Its parts mount when it opens and leave once it has closed.
 *
 * `role="alertdialog"` is for a question that interrupts, such as confirming a deletion. A tap on the dim then does
 * not close it, so a stray tap cannot answer it, and focus starts on its `Trigger.Close`. Escape still closes it, and
 * so does a swipe, which is as deliberate.
 *
 * @example
 * <Dialog.Root role="alertdialog" size="sm">
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
 *
 * <Dialog.Root size="lg" phone="full-screen">…</Dialog.Root>
 */
export function DialogRoot(props: DialogRootProps): Element {
  return (
    <DialogLookContext value={lookOf(props)}>
      <Seed.Root
        {...omit(props, "size", "phone", "closeOnInteractOutside")}
        swipeDirection="down"
        closeOnInteractOutside={closesOnInteractOutside(props)}
        lazyMount
        unmountOnExit
      />
    </DialogLookContext>
  )
}

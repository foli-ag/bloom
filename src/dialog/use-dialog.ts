import { useDrawer, type UseDrawerProps, type UseDrawerReturn } from "@foliag/seeds/drawer"

/** What a dialog takes of a drawer's props: all but those of the swipe, which a dialog only does down, to close */
export type UseDialogProps = Omit<UseDrawerProps, SwipeProp>

export type UseDialogReturn = UseDrawerReturn

export type SwipeProp =
  | "snapPoints"
  | "snapPoint"
  | "defaultSnapPoint"
  | "onSnapPointChange"
  | "snapToSequentialPoints"
  | "swipeDirection"
  | "swipeVelocityThreshold"
  | "closeThreshold"
  | "preventDragOnScroll"
  | "stack"

/**
 * Runs a dialog made to be read and set from outside it, for a `RootProvider`. It is zag's drawer, which does all a
 * dialog does, Escape, the trapped focus, the page that neither scrolls nor reads out, and also follows a thumb that
 * swipes it down on a phone.
 */
export function useDialog(props: UseDialogProps | (() => UseDialogProps) = {}): UseDialogReturn {
  return useDrawer(() => {
    const own = typeof props === "function" ? props() : props
    return { ...own, swipeDirection: "down", closeOnInteractOutside: closesOnInteractOutside(own) }
  })
}

/**
 * As zag's dialog does, a press on the dim leaves an alert dialog open, so a stray tap cannot answer it, and one that
 * is not modal too, as the page around it is in use. Zag's drawer closes on it whatever the role.
 */
export function closesOnInteractOutside(props: Pick<UseDialogProps, "closeOnInteractOutside" | "modal" | "role">) {
  return props.closeOnInteractOutside ?? (props.modal !== false && props.role !== "alertdialog")
}

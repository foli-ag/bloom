import type { ValidComponent } from "@foliag/seeds/polymorphic"
import { useSelectContext } from "@foliag/seeds/select"
import type { Element } from "solid-js"
import { SheetClose, type SheetCloseProps } from "../internal/sheet.jsx"

export type SelectTriggerCloseProps<As extends ValidComponent = "button"> = SheetCloseProps<As>

/**
 * Closes the sheet without choosing, on a phone, and sends focus back to the field. A part seeds does not have, placed
 * in the `Positioner` after the `Content`. From 640px the list is a dropdown and it is not shown. It has no look:
 * render it as a `Button` that spans the sheet.
 */
export function SelectTriggerClose<As extends ValidComponent = "button">(props: SelectTriggerCloseProps<As>): Element {
  const api = useSelectContext()
  return <SheetClose button={props} onClose={() => api().setOpen(false)} />
}

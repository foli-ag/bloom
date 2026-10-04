import type { PolymorphicProps, ValidComponent } from "@foliag/seeds/polymorphic"
import { dynamic, type JSX } from "@solidjs/web"
import { omit, type Element } from "solid-js"

export type SheetCloseProps<As extends ValidComponent = "button"> = PolymorphicProps<
  As,
  {
    /** Its words, such as "Fermer" */
    children: JSX.Element
  }
>

/**
 * The button at the foot of a bottom sheet that closes it without choosing anything. A sheet always has one, because
 * a tap on the dim above it is not obvious to everyone. From 640px the panel is a dropdown and it is not shown.
 *
 * It sits outside the list, whose role allows only options or items inside it. Like a trigger it is a bare button
 * that takes its look from what it renders as, usually a `Button`. A tap anywhere on the foot around it closes the
 * sheet too, and a handler the app puts on the button still runs, as the click is caught on its way up.
 */
export function SheetClose<As extends ValidComponent = "button">(props: {
  button: SheetCloseProps<As>
  onClose: () => void
}): Element {
  const Rendered = dynamic(() => props.button.as ?? "button")
  return (
    <div data-sheet-close class="shrink-0 border-t-2 border-border p-3 sm:hidden" onClick={() => props.onClose()}>
      <Rendered {...omit(props.button, "as")} />
    </div>
  )
}

interface OutsideEvent {
  detail: { originalEvent: Event }
  preventDefault(): void
}

/**
 * Zag closes a list as soon as a press or focus lands outside it, and then leaves focus where it went. The sheet's
 * close button is outside the list, so a press there would close the sheet with focus on a button about to be
 * removed. This lets that press through, and the button closes the sheet itself, which sends focus back to the
 * trigger.
 */
export function keepOpenForSheetClose<E extends OutsideEvent>(own: ((event: E) => void) | undefined) {
  return (event: E) => {
    own?.(event)
    if (isSheetClose(event.detail.originalEvent.target)) event.preventDefault()
  }
}

function isSheetClose(target: EventTarget | null) {
  return target instanceof globalThis.Element && target.closest("[data-sheet-close]") !== null
}

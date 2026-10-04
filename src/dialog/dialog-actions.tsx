import type { JSX } from "@solidjs/web"
import type { Element } from "solid-js"
import { tv } from "../internal/variants.js"
import { actions } from "../internal/overlay.js"
import { useDialogLook } from "./dialog-look.js"

export interface DialogActionsProps {
  /** The buttons, the one that backs out first: the main one then ends up last */
  children: JSX.Element
  class?: string | undefined
}

/**
 * The dialog's buttons, a part seeds does not have. On a phone they stack at full width, the main one at the bottom
 * where the thumb rests. From 640px they sit in a row at the end, the main one last. In a dialog long enough to scroll
 * they stay in reach at its foot, and what scrolls passes under them. In a dialog that takes the whole screen of a phone
 * they sit at the foot of the screen even when the rest is short.
 */
export function DialogActions(props: DialogActionsProps): Element {
  const look = useDialogLook()
  return (
    <div class={actions({ class: [foot({ phone: look.phone() }), props.class] })}>
      {props.children}
      <span aria-hidden="true" class={edge()} />
    </div>
  )
}

// It sticks to the bottom edge as wide as the dialog, on the dialog's own surface (named, as a <form> around it has
// none to inherit), and takes the dialog's bottom padding, so nothing shows below it. A sticky part stops at the
// padding of what scrolls, so it is held that far past it.
const foot = tv({
  base: [
    "sticky z-10 mt-0 bg-raised pt-2 [container-type:scroll-state]",
    "-mr-(--dialog-right) -ml-(--dialog-left) pr-(--dialog-right) pl-(--dialog-left)",
    "-mb-[max(1.25rem,env(safe-area-inset-bottom))] pb-[max(1.25rem,env(safe-area-inset-bottom))]",
    "-bottom-[max(1.25rem,env(safe-area-inset-bottom))]",
    "sm:-mx-6 sm:-mb-6 sm:px-6 sm:pb-6 sm:-bottom-6",
  ],
  variants: {
    phone: { sheet: "", "full-screen": "max-sm:mt-auto" },
  },
})

// A line along its top while something scrolls under it, where the browser can tell (`scroll-state`), so the foot
// reads as a layer above the text and not as the text cut short
const edge = tv({
  base: [
    "pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-border opacity-0",
    "transition-opacity duration-(--duration-smooth) ease-smooth",
    "[@container_scroll-state(stuck:bottom)]:opacity-100",
  ],
})

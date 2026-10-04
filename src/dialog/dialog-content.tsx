import { Dialog as Seed } from "@foliag/seeds/dialog"
import { omit, untrack, type Element } from "solid-js"
import { tv } from "../internal/variants.js"
import { useDialogLook } from "./dialog-look.js"

export type DialogContentProps = Omit<Seed.ContentProps, "class"> & {
  class?: string | undefined
}

/**
 * The dialog itself. On a phone it is a sheet that rises from the bottom edge, from 640px a card that grows into place
 * as it rises a little. Its parts stack with even gaps, a long one scrolls inside, and on a phone its foot clears the
 * home indicator. A press on the dim that leaves it open, as on an alert dialog, is answered: it swells a little and
 * settles back, so the press reads as seen and the eye goes back to the question.
 *
 * The root's `size` sets the card's width from 640px. With `phone="full-screen"` it takes the whole screen of a phone
 * instead of rising as a sheet: it slides up from the bottom edge all the same, solid, and back down as it closes,
 * turning round if the farmer changes their mind half way, and only fades under reduced motion. Its edges clear the
 * notch, the rounded corners and the home indicator (`env(safe-area-inset-*)`, which needs `viewport-fit=cover`).
 */
export function DialogContent(props: DialogContentProps): Element {
  const look = useDialogLook()
  return (
    <Seed.Content
      {...omit(props, "class", "ref")}
      ref={(element: HTMLElement) => {
        answerPressesOutside(element)
        forwardRef(
          untrack(() => props.ref),
          element,
        )
      }}
      class={content({ size: look.size(), phone: look.phone(), class: props.class })}
    />
  )
}

/**
 * Zag tells the content about a press outside it with a `pointerdown.outside` event, and cancels that event when the
 * dialog is to stay open. The cancel comes from a listener added after this one, so the check waits for the event to
 * be through. A press in a layer above, such as a select's sheet, or under another dialog, is not cancelled, and goes
 * unanswered. The swell runs on the positioner (`data-swell`), and a second press while it runs adds nothing, as
 * starting it over would jump.
 */
function answerPressesOutside(content: HTMLElement) {
  content.addEventListener("pointerdown.outside", (event) => {
    queueMicrotask(() => {
      if (!event.defaultPrevented || content.getAttribute("data-state") !== "open") return
      const positioner = content.closest<HTMLElement>('[data-scope="dialog"][data-part="positioner"]')
      if (!positioner || positioner.hasAttribute("data-swell")) return
      const settle = (end: Event) => {
        if (end.target !== positioner) return
        positioner.removeAttribute("data-swell")
        positioner.removeEventListener("animationend", settle)
        positioner.removeEventListener("animationcancel", settle)
      }
      positioner.addEventListener("animationend", settle)
      positioner.addEventListener("animationcancel", settle)
      positioner.setAttribute("data-swell", "")
    })
  })
}

/** The caller's own ref, which the compiler hands over as a callback or an array of them */
function forwardRef(ref: unknown, element: HTMLElement) {
  if (Array.isArray(ref)) for (const each of ref) forwardRef(each, element)
  else if (typeof ref === "function") ref(element)
}

// The sheet slides in and out solid, as it comes from off the screen, and only fades under reduced motion. The card
// comes up from below, as the sheet does on a phone. A full screen is a sheet as tall as the screen, so it moves as one.
// Its sides are `--dialog-left` and `--dialog-right`, which `Actions` reads to reach the edges.
const content = tv({
  base: [
    "relative flex w-full flex-col gap-4 overflow-y-auto overscroll-contain bg-raised p-5 text-ink",
    "[--dialog-left:1.25rem] [--dialog-right:1.25rem] pr-(--dialog-right) pl-(--dialog-left)",
    "shadow-overlay outline-none",
    "max-sm:pb-[max(1.25rem,env(safe-area-inset-bottom))] max-sm:presence-sheet",
    "sm:max-h-[90dvh] sm:rounded-card sm:border-2 sm:border-strong sm:p-6",
    "sm:presence-overlay sm:[--presence-from:0_calc(var(--enter-distance)*0.5)]",
  ],
  variants: {
    size: {
      sm: "sm:max-w-md",
      md: "sm:max-w-lg",
      lg: "sm:max-w-3xl",
    },
    phone: {
      sheet: "max-sm:max-h-[90dvh] max-sm:rounded-t-card max-sm:border-t-2 max-sm:border-strong",
      "full-screen": [
        "max-sm:h-dvh max-sm:max-h-dvh max-sm:shadow-none",
        "max-sm:pt-[max(1.25rem,env(safe-area-inset-top))]",
        "max-sm:[--dialog-left:max(1.25rem,env(safe-area-inset-left))]",
        "max-sm:[--dialog-right:max(1.25rem,env(safe-area-inset-right))]",
      ],
    },
  },
  defaultVariants: { size: "md", phone: "sheet" },
})

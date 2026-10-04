import { Drawer as Seed } from "@foliag/seeds/drawer"
import { omit, untrack, type Element } from "solid-js"
import { tv } from "../internal/variants.js"

export type DrawerGrabberProps = Omit<Seed.GrabberProps, "class"> & {
  /** A `Grabber.Indicator` */
  children?: Element
  class?: string | undefined
}

/**
 * The strip along the free edge of a bottom or top drawer, 40px tall and as wide as the drawer, that drags it even
 * where its content scrolls. It stays in view while the content scrolls under it. It is for the thumb only: the
 * keyboard and a screen reader close the drawer with its `Trigger.Close` or Escape. A drawer on the left or the right
 * edge drags from anywhere, so there it is hidden.
 */
export function DrawerGrabber(props: DrawerGrabberProps): Element {
  return (
    <Seed.Grabber
      {...omit(props, "class", "ref")}
      ref={(element: HTMLElement) => {
        holdScrollWhileGrabbed(element)
        forwardRef(
          untrack(() => props.ref),
          element,
        )
      }}
      class={grabber({ class: props.class })}
    />
  )
}

/**
 * Zag starts a drag only where the content cannot scroll that way, so that a swipe on a long list scrolls it. The
 * grabber is inside the content, so it was dead whenever the list could scroll, the very case it is for: it could not
 * open a drawer resting on a snap point, nor pull down one whose list was scrolled. While a finger holds it, the content
 * is `data-grabbed` and does not scroll, which keeps the list where it was. A mouse is left out, as hiding a scrollbar
 * that takes room would shift the content under the pointer.
 */
function holdScrollWhileGrabbed(grabber: HTMLElement) {
  grabber.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse") return
    const content = grabber.closest<HTMLElement>('[data-scope="drawer"][data-part="content"]')
    if (!content) return
    const doc = grabber.ownerDocument
    const release = () => {
      content.removeAttribute("data-grabbed")
      doc.removeEventListener("pointerup", release, true)
      doc.removeEventListener("pointercancel", release, true)
    }
    content.setAttribute("data-grabbed", "")
    doc.addEventListener("pointerup", release, true)
    doc.addEventListener("pointercancel", release, true)
  })
}

/** The caller's own ref, which the compiler hands over as a callback or an array of them */
function forwardRef(ref: unknown, element: HTMLElement) {
  if (Array.isArray(ref)) for (const each of ref) forwardRef(each, element)
  else if (typeof ref === "function") ref(element)
}

// It takes the drawer's padding on that edge, the top one of a bottom drawer and the bottom one of a top drawer, and
// the drawer's own background, so what scrolls under it does not show through. A sticky part stops at the padding of
// what scrolls, so it is held 1.25rem past it, at the edge itself.
const grabber = tv({
  base: [
    "group/grabber sticky z-10 -mx-5 flex h-10 shrink-0 pressable cursor-grab items-center justify-center bg-inherit",
    "active:cursor-grabbing",
    "in-data-[swipe-direction=down]:-top-5 in-data-[swipe-direction=down]:-mt-5 in-data-[swipe-direction=down]:-mb-2",
    "in-data-[swipe-direction=up]:-bottom-5 in-data-[swipe-direction=up]:order-last",
    "in-data-[swipe-direction=up]:-mt-2 in-data-[swipe-direction=up]:-mb-5",
    "in-data-[swipe-direction=left]:hidden in-data-[swipe-direction=right]:hidden",
  ],
})

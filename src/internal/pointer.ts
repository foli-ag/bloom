import { createSignal, onSettled } from "solid-js"

/**
 * Whether the pointer that went down on a control has moved since by more than a tap's jitter: a slider's or a dial's.
 * Zag puts the value under the pointer as it goes down, and the handle glides there; from the first real move on, the
 * handle follows the pointer with no transition, so it never trails behind it.
 */
export function createFollowing(): [following: () => boolean, ref: (control: HTMLElement) => void] {
  const [following, setFollowing] = createSignal(false)
  let stop: (() => void) | undefined
  const ref = (control: HTMLElement) => {
    control.addEventListener(
      "pointerdown",
      (down) => {
        stop?.()
        const doc = control.ownerDocument
        const move = (event: PointerEvent) => {
          if (Math.hypot(event.clientX - down.clientX, event.clientY - down.clientY) > 3) setFollowing(true)
        }
        const end = () => stop?.()
        doc.addEventListener("pointermove", move, true)
        doc.addEventListener("pointerup", end, true)
        doc.addEventListener("pointercancel", end, true)
        stop = () => {
          doc.removeEventListener("pointermove", move, true)
          doc.removeEventListener("pointerup", end, true)
          doc.removeEventListener("pointercancel", end, true)
          stop = undefined
          setFollowing(false)
        }
      },
      true,
    )
  }
  onSettled(() => () => stop?.())
  return [following, ref]
}

/**
 * Zag focuses a part itself after a press, a slider's handle, a dial's needle or the star that takes a mark, and the
 * browser then rings it as it would for the keyboard. The control notes whether a pointer or a key moved it last, until
 * focus leaves it, as `data-pointer`, and sets `--focus-style: none` from it, so the ring shows only after a key.
 */
export function notePointer(control: HTMLElement) {
  control.addEventListener("pointerdown", () => control.setAttribute("data-pointer", ""))
  control.addEventListener("keydown", () => control.removeAttribute("data-pointer"))
  control.addEventListener("focusout", (event) => {
    if (!control.contains(event.relatedTarget as Node | null)) control.removeAttribute("data-pointer")
  })
}

/** The caller's own ref, which the compiler hands over as a callback or an array of them */
export function forwardRef(ref: unknown, element: HTMLElement) {
  if (Array.isArray(ref)) for (const each of ref) forwardRef(each, element)
  else if (typeof ref === "function") ref(element)
}

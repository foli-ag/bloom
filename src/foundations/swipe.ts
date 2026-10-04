/**
 * Drags `element` down by `dy` pixels, or up when it is negative, with a touch pointer, the way a thumb does. Zag
 * follows the pointer from its first move, so the events are dispatched one by one.
 */
export async function swipe(element: HTMLElement, dy: number): Promise<void> {
  const { left, top } = element.getBoundingClientRect()
  const init = { bubbles: true, pointerId: 1, pointerType: "touch", isPrimary: true, clientX: left + 20, button: 0 }
  element.dispatchEvent(new PointerEvent("pointerdown", { ...init, clientY: top + 20, buttons: 1 }))
  for (let step = 1; step <= 10; step++) {
    element.dispatchEvent(
      new PointerEvent("pointermove", { ...init, clientY: top + 20 + (dy * step) / 10, buttons: 1 }),
    )
    await frame()
  }
  element.dispatchEvent(new PointerEvent("pointerup", { ...init, clientY: top + 20 + dy }))
}

export function frame(): Promise<number> {
  return new Promise((resolve) => requestAnimationFrame(resolve))
}

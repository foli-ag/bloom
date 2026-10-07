import { isServer } from "@solidjs/web"
import { createSignal, type Accessor } from "solid-js"

/** Marks a part as there, or gone */
export type Mark = (present: boolean) => void

/**
 * Whether a part is there, for the part that points at it (`aria-labelledby`, `aria-describedby`): the part marks
 * itself as it mounts and unmarks itself as it goes. In the browser it is a signal, so the pointer follows a part that
 * comes and goes, written from inside a component, the one place this is wanted. A server render may not write a
 * signal, and renders in order, once: there it is a plain flag, which a part rendered after the marked one reads, as
 * a signal written there was read before.
 */
export function createPresence(): [present: Accessor<boolean>, mark: Mark] {
  if (isServer) {
    let present = false
    return [() => present, (next) => (present = next)]
  }
  return createSignal(false, { ownedWrite: true })
}

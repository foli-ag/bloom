import { Clipboard as Seed } from "@foliag/seeds/clipboard"
import { omit, type Element } from "solid-js"
import { fieldRoot } from "../internal/field.js"
import { translations } from "./use-clipboard.js"

export type ClipboardRootProps = Omit<Seed.RootProps, "class" | "translations"> & {
  /** Merged after the component's own classes, and wins over them */
  class?: string | undefined
}

/**
 * A value to pass on, such as a link that invites a farm worker or a parcel's reference, with a button that copies
 * it. The button's words change for `timeout` milliseconds after a copy, so the farmer sees it worked.
 *
 * Its parts stack with even gaps. The trigger is seeds' own, with no look: render it as a `Button` holding an
 * `Indicator`, whose two sets of words are the button's name before and after the copy.
 *
 * @example
 * <Clipboard.Root defaultValue="https://foli.ag/invitation/7KQ2">
 *   <Clipboard.Label>Lien d'invitation</Clipboard.Label>
 *   <Clipboard.Control>
 *     <Clipboard.Input />
 *     <Clipboard.Trigger as={Button} variant="outline">
 *       <Clipboard.Indicator copied="Copié">Copier</Clipboard.Indicator>
 *     </Clipboard.Trigger>
 *   </Clipboard.Control>
 * </Clipboard.Root>
 */
export function ClipboardRoot(props: ClipboardRootProps): Element {
  return <Seed.Root {...omit(props, "class")} translations={translations} class={fieldRoot({ class: props.class })} />
}

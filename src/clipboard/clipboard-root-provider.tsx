import { Clipboard as Seed } from "@foliag/seeds/clipboard"
import { omit, type Element } from "solid-js"
import { fieldRoot } from "../internal/field.js"

export type ClipboardRootProviderProps = Omit<Seed.RootProviderProps, "class"> & {
  class?: string | undefined
}

/** A root for a machine made with bloom's `useClipboard`, whose state the app then reads and sets from outside it */
export function ClipboardRootProvider(props: ClipboardRootProviderProps): Element {
  return <Seed.RootProvider {...omit(props, "class")} class={fieldRoot({ class: props.class })} />
}

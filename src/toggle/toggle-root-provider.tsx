import { Toggle as Seed } from "@foliag/seeds/toggle"
import type { JSX } from "@solidjs/web"
import { omit, type Element } from "solid-js"
import { toggleContent, toggleRoot } from "./toggle-root.jsx"

export type ToggleRootProviderProps = Omit<Seed.RootProviderProps, "class" | "children"> & {
  /** Its words, as for `Toggle.Root` */
  children: JSX.Element
  class?: string | undefined
}

/** A toggle made with `useToggle`, whose state the app then reads and sets from outside it */
export function ToggleRootProvider(props: ToggleRootProviderProps): Element {
  return (
    <Seed.RootProvider {...omit(props, "class", "children")} class={toggleRoot({ class: props.class })}>
      <span class={toggleContent()}>{props.children}</span>
    </Seed.RootProvider>
  )
}

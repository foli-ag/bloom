import { Splitter as Seed } from "@foliag/seeds/splitter"
import { omit, type Element } from "solid-js"
import { root } from "./splitter-root.jsx"

export type SplitterRootProviderProps = Omit<Seed.RootProviderProps, "class"> & {
  class?: string | undefined
}

/** A root for panels made with `useSplitter`, whose state the app then reads and sets from outside it. It looks like `Root`. */
export function SplitterRootProvider(props: SplitterRootProviderProps): Element {
  return <Seed.RootProvider {...omit(props, "class")} class={root({ class: props.class })} />
}

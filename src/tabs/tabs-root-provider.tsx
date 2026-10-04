import { Tabs as Seed } from "@foliag/seeds/tabs"
import { omit, type Element } from "solid-js"
import { root } from "./tabs-root.jsx"

export type TabsRootProviderProps = Omit<Seed.RootProviderProps, "class"> & {
  class?: string | undefined
}

/** A root for tabs made with `useTabs`, whose state the app then reads and sets from outside it. It looks like `Root`. */
export function TabsRootProvider(props: TabsRootProviderProps): Element {
  return <Seed.RootProvider {...omit(props, "class")} class={root({ class: props.class })} />
}

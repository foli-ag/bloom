import { Tabs as Seed } from "@foliag/seeds/tabs"
import { omit, type Element } from "solid-js"
import { root } from "./tabs-root.jsx"
import { type TabsVariant, TabsVariantContext } from "./tabs-variant.js"

export type TabsRootProviderProps = Omit<Seed.RootProviderProps, "class"> & {
  /** `line`, the default, or `segmented`, as on `Root` */
  variant?: TabsVariant | undefined
  class?: string | undefined
}

/** A root for tabs made with `useTabs`, whose state the app then reads and sets from outside it. It looks like `Root`. */
export function TabsRootProvider(props: TabsRootProviderProps): Element {
  return (
    <TabsVariantContext value={() => props.variant ?? "line"}>
      <Seed.RootProvider {...omit(props, "class", "variant")} class={root({ class: props.class })} />
    </TabsVariantContext>
  )
}

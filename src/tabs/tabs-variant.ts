import { type Accessor, createContext, useContext } from "solid-js"

export type TabsVariant = "line" | "segmented"

/**
 * The look the root gives its tabs, read by its parts. A context and not a class on the root, so tabs inside another
 * one's page take their own look.
 */
export const TabsVariantContext = /* @__PURE__ */ createContext<Accessor<TabsVariant>>(() => "line")

export const useTabsVariant = () => useContext(TabsVariantContext)

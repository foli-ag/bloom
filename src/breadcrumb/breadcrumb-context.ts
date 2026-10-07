import { createContext, useContext, type Accessor } from "solid-js"

/**
 * A trail of four pages or more can fold its start on a phone. Its items count themselves as they mount, and the
 * ellipsis unfolds it.
 */
export interface BreadcrumbState {
  expanded: Accessor<boolean>
  expand: () => void
}

export const BreadcrumbContext = /* @__PURE__ */ createContext<BreadcrumbState | undefined>(undefined)

export function useBreadcrumbContext(): BreadcrumbState {
  const state = useContext(BreadcrumbContext)
  if (!state) throw new Error("A Breadcrumb part is used outside Breadcrumb.Root")
  return state
}

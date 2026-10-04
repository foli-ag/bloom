import { createContext, useContext, type Accessor, type Setter } from "solid-js"

/**
 * Whether the progress has a `Label`. Zag names the bar by its value alone, so the bar points at the label itself
 * when there is one, and keeps the value as its name when there is not, as a spinner has no label.
 */
export const ProgressLabelled = /* @__PURE__ */ createContext<[Accessor<boolean>, Setter<boolean>] | undefined>(
  undefined,
)

export const useProgressLabelled = () => useContext(ProgressLabelled)

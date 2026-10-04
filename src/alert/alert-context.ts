import { createContext, useContext, type Accessor } from "solid-js"
import type { StatusTone } from "../internal/icons.jsx"

/** What the parts of an alert read from it: its tone, for the mark, and how to dismiss it */
export interface AlertState {
  tone: Accessor<StatusTone>
  close: () => void
}

export const AlertContext = /* @__PURE__ */ createContext<AlertState | undefined>(undefined)

export function useAlertContext(): AlertState {
  const state = useContext(AlertContext)
  if (!state) throw new Error("An Alert part is used outside Alert.Root")
  return state
}

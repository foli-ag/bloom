import { createContext, useContext } from "solid-js"
import type { Mark } from "../internal/presence.js"

/**
 * What the parts of a card need from it. A card rendered as a button may only hold phrasing content, so its parts
 * render as spans. A card that is a link or a button takes its name from its `Title` and its description from its
 * `Description`, which say they are there as they mount.
 */
export interface CardState {
  phrasing: boolean
  titleId: string
  descriptionId: string
  setTitled: Mark
  setDescribed: Mark
}

export const CardContext = /* @__PURE__ */ createContext<CardState | undefined>(undefined)

export const useCardContext = () => useContext(CardContext)

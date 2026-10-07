import { createContext, useContext } from "solid-js"

/**
 * What the parts of a card need from it. A card rendered as a button may only hold phrasing content, so its parts
 * render as spans. A card that is a link or a button points at the ids its `Title` and `Description` take, so it is
 * named by the one and described by the other.
 */
export interface CardState {
  phrasing: boolean
  titleId: string
  descriptionId: string
}

export const CardContext = /* @__PURE__ */ createContext<CardState | undefined>(undefined)

export const useCardContext = () => useContext(CardContext)

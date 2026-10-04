import { createContext, useContext, type Accessor } from "solid-js"

/** Whether the root asks its row to show the slides next to the current one at its edges */
export const CarouselPeek = /* @__PURE__ */ createContext<Accessor<boolean> | null>(null)

export const useCarouselPeek = (): Accessor<boolean> => {
  const peek = useContext(CarouselPeek)
  return () => peek?.() ?? false
}

import { createContext, useContext } from "solid-js"

export type NumberInputVariant = "field" | "stepper"

/**
 * How the `Control` lays its parts out, read by the input and the two buttons inside it: as a field between two of the
 * app's buttons, or as one stepper box whose buttons are its own.
 */
export const NumberInputVariantContext = /* @__PURE__ */ createContext<() => NumberInputVariant>(() => "field")

export const useNumberInputVariant = () => useContext(NumberInputVariantContext)

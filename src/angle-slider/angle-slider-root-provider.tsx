import { AngleSlider as Seed } from "@foliag/seeds/angle-slider"
import { omit, type Element } from "solid-js"
import { root } from "./angle-slider-root.jsx"

export type AngleSliderRootProviderProps = Omit<Seed.RootProviderProps, "class"> & {
  class?: string | undefined
}

/** A root for a dial made with `useAngleSlider`, whose state the app then reads and sets from outside it. It looks like `Root`. */
export function AngleSliderRootProvider(props: AngleSliderRootProviderProps): Element {
  return <Seed.RootProvider {...omit(props, "class")} class={root({ class: props.class })} />
}

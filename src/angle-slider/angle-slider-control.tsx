import { AngleSlider as Seed } from "@foliag/seeds/angle-slider"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"

export type AngleSliderControlProps = Omit<Seed.ControlProps, "class"> & {
  class?: string | undefined
}

/**
 * The dial, a 192px disc with an edge that reaches 3:1. It holds a `MarkerGroup` and the `Thumb`, laid over each
 * other. A press anywhere on it points the needle there.
 */
export function AngleSliderControl(props: AngleSliderControlProps): Element {
  return <Seed.Control {...omit(props, "class")} class={control({ class: props.class })} />
}

const control = tv({
  base: [
    "relative col-span-2 size-48 cursor-pointer justify-self-center rounded-full border-2 border-strong bg-raised",
    "data-disabled:cursor-not-allowed data-disabled:border-disabled data-disabled:bg-disabled",
    "data-invalid:border-danger-text",
  ],
})

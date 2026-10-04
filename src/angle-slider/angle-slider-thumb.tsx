import { AngleSlider as Seed } from "@foliag/seeds/angle-slider"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"

export type AngleSliderThumbProps = Omit<Seed.ThumbProps, "class" | "children"> & {
  /**
   * The angle as a screen reader says it, such as "45°" or "Nord-est". Zag gives only the bare number, so pass it
   * whenever the unit matters.
   */
  "aria-valuetext"?: string | undefined
  class?: string | undefined
}

/**
 * The needle: a line from the center to a 28px knob near the edge, turned to `--angle`. It covers the whole dial, so
 * its focus ring is the dial's outline. The knob grows while the needle is dragged.
 */
export function AngleSliderThumb(props: AngleSliderThumbProps): Element {
  return (
    <Seed.Thumb {...omit(props, "class")} class={thumb({ class: props.class })}>
      <span aria-hidden="true" class={needle()} />
      <span aria-hidden="true" class={knob()} />
    </Seed.Thumb>
  )
}

const thumb = tv({
  base: [
    "group/thumb absolute inset-0 rounded-full outline-none",
    "focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-focus",
  ],
})

const needle = tv({
  base: [
    "absolute start-1/2 top-6 bottom-1/2 w-1 -translate-x-1/2 rounded-full bg-primary-edge",
    "group-data-disabled/thumb:bg-disabled-ink group-data-invalid/thumb:bg-danger-text",
  ],
})

const knob = tv({
  base: [
    "absolute start-1/2 top-1.5 size-7 -translate-x-1/2 rounded-full border-2 border-primary-edge bg-primary",
    "transition-[scale] duration-(--duration-pop) ease-pop group-hover/thumb:bg-primary-400",
    "group-active/thumb:scale-125 group-active/thumb:duration-(--duration-press) group-active/thumb:ease-press",
    "group-data-disabled/thumb:border-disabled group-data-disabled/thumb:bg-disabled-ink",
    "group-data-invalid/thumb:border-danger-text",
  ],
})

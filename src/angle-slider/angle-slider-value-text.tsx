import { AngleSlider as Seed, useAngleSliderContext } from "@foliag/seeds/angle-slider"
import type { JSX } from "@solidjs/web"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"

export type AngleSliderValueTextProps = Omit<Seed.ValueTextProps, "class" | "children"> & {
  /**
   * The angle as the farmer reads it, ``(value) => `${value}°` `` or a compass point. There is no default, because
   * zag's "45deg" is CSS, not words.
   */
  children: (value: number) => JSX.Element
  class?: string | undefined
}

export function AngleSliderValueText(props: AngleSliderValueTextProps): Element {
  const api = useAngleSliderContext()
  return (
    <Seed.ValueText {...omit(props, "class", "children")} class={valueText({ class: props.class })}>
      {props.children(api().value)}
    </Seed.ValueText>
  )
}

// The value is information, so it stays readable when the dial is disabled
const valueText = tv({
  base: "text-base font-semibold tracking-body text-ink tabular-nums",
})

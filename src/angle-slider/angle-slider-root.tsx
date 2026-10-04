import { AngleSlider as Seed } from "@foliag/seeds/angle-slider"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"

export type AngleSliderRootProps = Omit<Seed.RootProps, "class"> & {
  /** Merged after the component's own classes, and wins over them */
  class?: string | undefined
}

/**
 * A direction picked on a dial, from 0 to 359 degrees, 0 at the top and turning clockwise: the wind, the way rows run.
 * A press anywhere on the dial points the needle there, so the whole dial is the target. The arrow keys turn it by
 * `step`, Home and End take it to 0 and 359.
 *
 * The label sits on the left and the value on the right, with the dial under both. `HiddenInput` carries the value
 * into a form, under `name`.
 *
 * @example
 * <AngleSlider.Root name="vent" step={5} defaultValue={45}>
 *   <AngleSlider.Label>Direction du vent</AngleSlider.Label>
 *   <AngleSlider.ValueText>{(value) => `${value}°`}</AngleSlider.ValueText>
 *   <AngleSlider.Control>
 *     <AngleSlider.MarkerGroup>
 *       <For each={[0, 90, 180, 270]}>{(value) => <AngleSlider.Marker value={value} />}</For>
 *     </AngleSlider.MarkerGroup>
 *     <AngleSlider.Thumb aria-valuetext={`${value()}°`} />
 *   </AngleSlider.Control>
 *   <AngleSlider.HiddenInput />
 * </AngleSlider.Root>
 */
export function AngleSliderRoot(props: AngleSliderRootProps): Element {
  return <Seed.Root {...omit(props, "class")} class={root({ class: props.class })} />
}

export const root = tv({ base: "grid w-fit grid-cols-[1fr_auto] items-center gap-x-4 gap-y-3" })

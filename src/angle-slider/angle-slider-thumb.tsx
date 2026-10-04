import { AngleSlider as Seed, useAngleSliderContext } from "@foliag/seeds/angle-slider"
import { createMemo, omit, type Element } from "solid-js"
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
 * The needle: a line from a hub at the center to a 28px knob near the edge, turned to the angle. It covers the whole
 * dial, so its focus ring is the dial's outline, but only the knob takes a press: a press on the knob turns the needle
 * from where it is, a press anywhere else on the dial points it there. The knob grows while the needle is dragged.
 *
 * It turns the short way round, so from 350° to 10° it goes on through north instead of back round the dial.
 */
export function AngleSliderThumb(props: AngleSliderThumbProps): Element {
  const api = useAngleSliderContext()
  // The angle as zag draws it, mirrored in a right-to-left page
  const angle = () => Number.parseFloat((api().getRootProps().style as Record<string, string>)["--angle"] ?? "0")
  // A turn that is not brought back into 0 to 360, so that the transition from one angle to the next is the shortest
  const turn = createMemo<number>((previous) => {
    const next = angle()
    if (previous === undefined) return next
    return previous + ((((next - previous) % 360) + 540) % 360) - 180
  })
  return (
    <Seed.Thumb
      {...omit(props, "class")}
      class={thumb({ class: props.class })}
      style={{ rotate: `${turn()}deg` }}
      data-dragging={api().dragging ? "" : undefined}
    >
      <span aria-hidden="true" class={needle()} />
      <span aria-hidden="true" class={hub()} />
      <span aria-hidden="true" class={knob()} />
    </Seed.Thumb>
  )
}

const thumb = tv({
  base: [
    "group/thumb pointer-events-none absolute inset-0 rounded-full",
    "transition-[rotate] duration-(--dial-glide) ease-smooth",
    "focus-ring [--focus-inset:3px]",
  ],
})

const needle = tv({
  base: [
    "absolute start-1/2 top-6 bottom-1/2 w-1 -translate-x-1/2 rounded-full bg-primary-edge",
    "group-data-disabled/thumb:bg-disabled-ink group-data-invalid/thumb:bg-danger-text",
  ],
})

// The pivot the needle turns on
const hub = tv({
  base: [
    "absolute start-1/2 top-1/2 size-3 -translate-1/2 rounded-full bg-primary-edge",
    "group-data-disabled/thumb:bg-disabled-ink group-data-invalid/thumb:bg-danger-text",
  ],
})

// It covers the tick it points at, which would otherwise show past its edge
const knob = tv({
  base: [
    "pointer-events-auto absolute start-1/2 top-1 size-7 -translate-x-1/2 cursor-grab rounded-full",
    "border-2 border-primary-edge bg-primary",
    "motion-touch group-hover/thumb:bg-primary-400",
    "group-data-dragging/thumb:scale-(--hold-scale) group-data-dragging/thumb:cursor-grabbing group-data-dragging/thumb:bg-primary-300",
    "group-data-dragging/thumb:[--press-duration:var(--duration-press)] group-data-dragging/thumb:[--press-ease:var(--ease-press)]",
    "group-data-readonly/thumb:cursor-default group-data-disabled/thumb:cursor-not-allowed group-data-disabled/thumb:border-disabled group-data-disabled/thumb:bg-disabled-ink",
    "group-data-invalid/thumb:border-danger-text",
  ],
})

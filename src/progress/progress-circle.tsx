import { Progress as Seed } from "@foliag/seeds/progress"
import { omit, type Element } from "solid-js"
import { tv, type VariantProps } from "../internal/variants.js"
import { useBarName } from "./progress-track.jsx"

export type ProgressCircleProps = Omit<Seed.CircleProps, "class"> &
  VariantProps<typeof circle> & {
    class?: string | undefined
  }

/**
 * The ring, which is what a screen reader finds. It holds a `Circle.Track` and a `Circle.Range`. While the value is
 * not known it turns, also under reduced motion, as it is what tells the farmer something is happening.
 *
 * `size="sm"` is a line of text tall, for next to words; `md` is 48px; `lg` 96px.
 */
export function ProgressCircle(props: ProgressCircleProps): Element {
  const name = useBarName()
  return (
    <Seed.Circle
      {...omit(props, "class", "size")}
      aria-labelledby={name.labelledBy()}
      aria-valuetext={name.valueText()}
      class={circle({ size: props.size, class: props.class })}
    />
  )
}

const circle = tv({
  base: "shrink-0 data-[state=indeterminate]:animate-spin-ring",
  variants: {
    size: {
      sm: "[--size:1.5rem] [--thickness:3px]",
      md: "[--size:3rem] [--thickness:5px]",
      lg: "[--size:6rem] [--thickness:8px]",
    },
  },
  defaultVariants: { size: "md" },
})

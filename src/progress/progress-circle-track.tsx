import { Progress as Seed } from "@foliag/seeds/progress"
import { omit, type Element } from "solid-js"
import { tv } from "../internal/variants.js"

export type ProgressCircleTrackProps = Omit<Seed.CircleTrackProps, "class"> & {
  class?: string | undefined
}

/** The whole ring behind the range, faint */
export function ProgressCircleTrack(props: ProgressCircleTrackProps): Element {
  return <Seed.Circle.Track {...omit(props, "class")} class={track({ class: props.class })} />
}

const track = tv({ base: "stroke-neutral-soft" })

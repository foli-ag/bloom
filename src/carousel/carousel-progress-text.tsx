import { Carousel as Seed } from "@foliag/seeds/carousel"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"

export type CarouselProgressTextProps = Omit<Seed.ProgressTextProps, "class" | "children"> & {
  class?: string | undefined
}

/** Where the farmer is, in the words of `translations.progressText`, its digits of even width */
export function CarouselProgressText(props: CarouselProgressTextProps): Element {
  return <Seed.ProgressText {...omit(props, "class")} class={progressText({ class: props.class })} />
}

const progressText = tv({ base: "text-base font-semibold tracking-body text-ink tabular-nums" })

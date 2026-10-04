import { Splitter as Seed } from "@foliag/seeds/splitter"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"

export type SplitterPanelProps = Omit<Seed.PanelProps, "class"> & {
  class?: string | undefined
}

/** One panel. What does not fit scrolls inside it, so a panel made narrow never pushes its neighbor. */
export function SplitterPanel(props: SplitterPanelProps): Element {
  return <Seed.Panel {...omit(props, "class")} class={panel({ class: props.class })} />
}

const panel = tv({ base: "min-h-0 min-w-0 overflow-auto" })

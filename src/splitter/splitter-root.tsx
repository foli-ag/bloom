import { Splitter as Seed } from "@foliag/seeds/splitter"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"

export type SplitterRootProps = Omit<Seed.RootProps, "class"> & {
  /** Merged after the component's own classes, and wins over them */
  class?: string | undefined
}

/**
 * Panels side by side, or stacked with `orientation="vertical"`, that share the room between them. A `ResizeTrigger`
 * between two panels moves the split by dragging or with the arrow keys, Home and End. It fills its container, so give
 * that a size.
 *
 * It is for wide screens, such as a map next to a list on a desktop. On a phone, show one panel at a time.
 *
 * @example
 * <Splitter.Root panels={[{ id: "carte", minSize: 30 }, { id: "liste", minSize: 20 }]} defaultSize={[60, 40]}>
 *   <Splitter.Panel id="carte">…</Splitter.Panel>
 *   <Splitter.ResizeTrigger id="carte:liste" aria-label="Largeur de la carte">
 *     <Splitter.ResizeTrigger.Indicator />
 *   </Splitter.ResizeTrigger>
 *   <Splitter.Panel id="liste">…</Splitter.Panel>
 * </Splitter.Root>
 */
export function SplitterRoot(props: SplitterRootProps): Element {
  return <Seed.Root {...omit(props, "class")} class={root({ class: props.class })} />
}

export const root = tv({ base: "text-ink" })

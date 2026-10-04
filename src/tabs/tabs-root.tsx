import { Tabs as Seed } from "@foliag/seeds/tabs"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"

export type TabsRootProps = Omit<Seed.RootProps, "class"> & {
  /** Merged after the component's own classes, and wins over them */
  class?: string | undefined
}

/**
 * Pages of one thing side by side, such as a parcel's summary, its interventions and its soil analyses, one shown at
 * a time. The tabs sit in a row above the page, or down the side with `orientation="vertical"`. A row too long for a
 * phone scrolls sideways. The arrow keys move between the tabs and show each page as they reach it.
 *
 * @example
 * <Tabs.Root defaultValue="resume">
 *   <Tabs.List aria-label="Parcelle">
 *     <Tabs.Trigger value="resume">Résumé</Tabs.Trigger>
 *     <Tabs.Trigger value="interventions">Interventions</Tabs.Trigger>
 *     <Tabs.Indicator />
 *   </Tabs.List>
 *   <Tabs.Content value="resume">…</Tabs.Content>
 *   <Tabs.Content value="interventions">…</Tabs.Content>
 * </Tabs.Root>
 */
export function TabsRoot(props: TabsRootProps): Element {
  return <Seed.Root {...omit(props, "class")} class={root({ class: props.class })} />
}

export const root = tv({ base: "flex min-w-0 flex-col data-[orientation=vertical]:flex-row" })

import { Tabs as Seed } from "@foliag/seeds/tabs"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"

export type TabsContentProps = Omit<Seed.ContentProps, "class"> & {
  class?: string | undefined
}

/**
 * The page of the tab with the same `value`. It fades in as its tab is chosen. The page it replaces goes at once, so
 * the two never show together and nothing below jumps.
 */
export function TabsContent(props: TabsContentProps): Element {
  return <Seed.Content {...omit(props, "class")} class={content({ class: props.class })} />
}

const content = tv({
  base: [
    "min-w-0 flex-1 rounded-box py-4 text-ink focus-ring data-[state=open]:animate-fade-in",
    "data-[orientation=vertical]:px-4 data-[orientation=vertical]:py-0",
  ],
})

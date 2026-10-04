import { Tabs as Seed } from "@foliag/seeds/tabs"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"

export type TabsContentProps = Omit<Seed.ContentProps, "class"> & {
  class?: string | undefined
}

/**
 * The page of the tab with the same `value`. It fades in as its tab is chosen. The page it replaces goes at once, so
 * the two never show together and nothing below jumps. The page shown with the screen is there at once.
 */
export function TabsContent(props: TabsContentProps): Element {
  return <Seed.Content {...omit(props, "class")} class={content({ class: props.class })} />
}

// A closing page is hidden in the same change that shows the new one. Zag would hide it a frame later, once it has
// looked for an exit animation, and until then a script that measures the page, or a test, finds both. The new page
// fades in from `@starting-style`, but only once the farmer has used the tabs: zag marks the root `data-focus` as a tab
// is clicked or reached with the keyboard, and not before, so the first page does not fade in with the screen around it.
const content = tv({
  base: [
    "min-w-0 flex-1 rounded-box py-4 text-ink focus-ring",
    "data-[orientation=vertical]:px-4 data-[orientation=vertical]:py-0",
    "data-[state=closed]:hidden",
    "transition-opacity duration-(--duration-smooth) ease-smooth group-data-focus/tabs:starting:opacity-0",
  ],
})

import type { JSX } from "@solidjs/web"
import { omit, type Element } from "solid-js"
import { tv } from "../internal/variants.js"

export type SkeletonProps = Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "class"> & {
  /** Merged after the component's own classes, and wins over them: its size and its shape */
  class?: string | undefined
}

/**
 * A placeholder in the shape of what is loading, so the page keeps its layout and the farmer sees what is coming. It is
 * a tinted box with nothing in it: give it a size and a shape with classes, and use one per line, avatar or picture. A
 * soft sheen crosses it now and then, on the compositor, so it keeps moving on a busy page; under reduced motion it
 * stays still.
 *
 * It is hidden from assistive technology, which has nothing to read in it. Mark what is loading instead: put
 * `aria-busy="true"` on the region the skeletons stand in, such as a card or a list, for as long as it loads, and say
 * it in words where a screen reader needs to know, with a status such as "Chargement des parcelles…".
 *
 * @example
 * <Card.Root aria-busy="true">
 *   <div class="flex items-center gap-3">
 *     <Skeleton class="size-12 rounded-full" />
 *     <Skeleton class="h-5 w-1/2" />
 *   </div>
 *   <div class="grid gap-2">
 *     <Skeleton class="h-4 w-full" />
 *     <Skeleton class="h-4 w-3/5" />
 *   </div>
 * </Card.Root>
 */
export function Skeleton(props: SkeletonProps): Element {
  const rest = omit(props, "class")
  return (
    <div {...rest} aria-hidden="true" data-scope="skeleton" data-part="root" class={skeleton({ class: props.class })} />
  )
}

// `rounded-lg` rather than bloom's `rounded-box`, which `cn` does not know, so an app's `rounded-full` replaces it
const skeleton = tv({ base: "skeleton shrink-0 rounded-lg" })

import type { JSX } from "@solidjs/web"
import { omit, Repeat, type Element } from "solid-js"
import { tv } from "../internal/variants.js"

export type SkeletonProps = Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "class"> & {
  /**
   * `text` stands in for lines of text, as tall as the text around it: put `text-xl` on it for a title. `circle` for
   * an avatar, 48px unless sized. `rect` for a photo, a map or a chart, 8rem tall unless sized.
   */
  shape?: "text" | "circle" | "rect" | undefined
  /** How many lines of text, the last one shorter, as a paragraph ends. 1 by default. */
  lines?: number | undefined
  /** Merged after the component's own classes, and wins over them: a width, a size, an aspect ratio */
  class?: string | undefined
}

/**
 * A placeholder in the shape of what is loading, so the page keeps its layout and the farmer sees what is coming. A
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
 *     <Skeleton shape="circle" />
 *     <Skeleton class="w-1/2 text-lg" />
 *   </div>
 *   <Skeleton lines={3} />
 * </Card.Root>
 */
export function Skeleton(props: SkeletonProps): Element {
  const rest = omit(props, "shape", "lines", "class")
  return (
    <div
      {...rest}
      aria-hidden="true"
      data-scope="skeleton"
      data-part="root"
      data-shape={props.shape ?? "text"}
      class={skeleton({ shape: props.shape ?? "text", class: props.class })}
    >
      {(props.shape ?? "text") === "text" ? (
        <Repeat count={Math.max(1, props.lines ?? 1)}>{() => <span class={line()} />}</Repeat>
      ) : null}
    </div>
  )
}

const skeleton = tv({
  base: "shrink-0",
  variants: {
    shape: {
      text: "grid w-full",
      circle: "skeleton size-12 rounded-full",
      rect: "skeleton h-32 w-full rounded-box",
    },
  },
})

// A bar as tall as a capital, in the middle of a line box of the text it stands in for, so swapping it for the words
// moves nothing. The last of several lines ends short, as a paragraph does.
const line = tv({
  base: ["skeleton my-[calc((1lh-0.75em)/2)] block h-[0.75em] rounded-full", "[&:last-child:not(:first-child)]:w-3/5"],
})

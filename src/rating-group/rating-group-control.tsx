import { RatingGroup as Seed, useRatingGroupContext } from "@foliag/seeds/rating-group"
import type { JSX } from "@solidjs/web"
import { For, omit, Show, type Element } from "solid-js"
import { tv } from "tailwind-variants"
import { RatingGroupItem } from "./rating-group-item.jsx"

export type RatingGroupControlProps = Omit<Seed.ControlProps, "class"> & {
  /** An `Item` for each mark. With none, it holds one star for each of the root's `count`. */
  children?: JSX.Element
  class?: string | undefined
}

/** The row of stars, side by side without gaps so a finger sliding along them never falls between two */
export function RatingGroupControl(props: RatingGroupControlProps): Element {
  const api = useRatingGroupContext()
  return (
    <Seed.Control {...omit(props, "class", "children")} class={control({ class: props.class })}>
      <Show
        when={props.children}
        fallback={<For each={api().items}>{(index) => <RatingGroupItem index={index} />}</For>}
      >
        {props.children}
      </Show>
    </Seed.Control>
  )
}

const control = tv({ base: "flex w-fit data-disabled:cursor-not-allowed" })

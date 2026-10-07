import { Progress as Seed } from "@foliag/seeds/progress"
import { omit, type Element } from "solid-js"
import { createPresence } from "../internal/presence.js"
import { ProgressLabelled } from "./progress-labelled.js"
import { ProgressLookContext, type ProgressTone } from "./progress-look.js"
import { lookOf, root } from "./progress-root.jsx"

export type ProgressRootProviderProps = Omit<Seed.RootProviderProps, "class"> & {
  /** As on `Root`: what the fill says about how things are going, which the label and the value say in words too */
  tone?: ProgressTone | undefined
  /** As on `Root`: one segment per step from `min` to `max` */
  segmented?: boolean | undefined
  class?: string | undefined
}

/**
 * A root for a progress made with bloom's `useProgress`, whose value the app then reads and sets from outside it. It
 * looks like `Root`.
 */
export function ProgressRootProvider(props: ProgressRootProviderProps): Element {
  return (
    // A `Label` sets it as it mounts, which is a write from inside a component, the one place this is wanted
    <ProgressLabelled value={createPresence()}>
      <ProgressLookContext value={lookOf(props)}>
        <Seed.RootProvider
          {...omit(props, "class", "tone", "segmented")}
          class={root({ tone: props.tone, class: props.class })}
        />
      </ProgressLookContext>
    </ProgressLabelled>
  )
}

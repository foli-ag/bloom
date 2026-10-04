import { Progress as Seed } from "@foliag/seeds/progress"
import { createSignal, omit, type Element } from "solid-js"
import { ProgressLabelled } from "./progress-labelled.js"
import { root } from "./progress-root.jsx"

export type ProgressRootProviderProps = Omit<Seed.RootProviderProps, "class"> & {
  class?: string | undefined
}

/**
 * A root for a progress made with bloom's `useProgress`, whose value the app then reads and sets from outside it. It
 * looks like `Root`.
 */
export function ProgressRootProvider(props: ProgressRootProviderProps): Element {
  return (
    // A `Label` sets it as it mounts, which is a write from inside a component, the one place this is wanted
    <ProgressLabelled value={createSignal(false, { ownedWrite: true })}>
      <Seed.RootProvider {...omit(props, "class")} class={root({ class: props.class })} />
    </ProgressLabelled>
  )
}

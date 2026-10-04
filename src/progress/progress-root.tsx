import { Progress as Seed } from "@foliag/seeds/progress"
import { createSignal, omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"
import { ProgressLabelled } from "./progress-labelled.js"
import type { ProgressTranslations } from "./use-progress.js"

export type ProgressRootProps = Omit<Seed.RootProps, "class" | "translations"> & {
  /** The words a screen reader says for the value, and while it is not known */
  translations: ProgressTranslations
  /** Merged after the component's own classes, and wins over them */
  class?: string | undefined
}

/**
 * How far along something is, such as a photo being sent over a weak connection: a bar across, or a ring. With
 * `value={null}` nobody knows how long it will take, and a ring turns, which makes it bloom's spinner.
 *
 * The label sits on the left and the value on the right, with the bar under both.
 *
 * @example
 * <Progress.Root value={sent()} translations={{ value: ({ percent }) => `${percent} %` }}>
 *   <Progress.Label>Envoi des photos</Progress.Label>
 *   <Progress.ValueText />
 *   <Progress.Track>
 *     <Progress.Range />
 *   </Progress.Track>
 * </Progress.Root>
 *
 * <Progress.Root value={null} translations={{ value: () => "Chargement" }}>
 *   <Progress.Circle>
 *     <Progress.Circle.Track />
 *     <Progress.Circle.Range />
 *   </Progress.Circle>
 * </Progress.Root>
 */
export function ProgressRoot(props: ProgressRootProps): Element {
  return (
    // A `Label` sets it as it mounts, which is a write from inside a component, the one place this is wanted
    <ProgressLabelled value={createSignal(false, { ownedWrite: true })}>
      <Seed.Root {...omit(props, "class")} class={root({ class: props.class })} />
    </ProgressLabelled>
  )
}

export const root = tv({ base: "grid w-full grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2" })

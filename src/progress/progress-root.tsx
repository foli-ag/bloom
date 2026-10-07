import { Progress as Seed } from "@foliag/seeds/progress"
import { omit, type Element } from "solid-js"
import { tv } from "../internal/variants.js"
import { ProgressLookContext, toneColors, type ProgressLook, type ProgressTone } from "./progress-look.js"
import type { ProgressTranslations } from "./use-progress.js"

export type ProgressRootProps = Omit<Seed.RootProps, "class" | "translations"> & {
  /** The words a screen reader says for the value, and while it is not known */
  translations: ProgressTranslations
  /**
   * What the fill says about how things are going: `success`, `warning` or `danger`, in green, amber or red. The color
   * only backs up the words. Say it in the label or the value too, "Stockage presque plein", "92 % · presque plein",
   * and in `translations.value`, so a screen reader hears it and it reads in the sun or without color. `ValueText`
   * puts the tone's mark before the value, a tick, a triangle or a circled "!", so it shows as a shape as well.
   */
  tone?: ProgressTone | undefined
  /**
   * The bar as one segment per step from `min` to `max`, such as the 5 steps of a sign-up, "3 of 5". The value counts
   * whole steps, and the segments it reaches fill one after the other.
   */
  segmented?: boolean | undefined
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
 *
 * <Progress.Root segmented value={step()} max={5} translations={{ value: ({ value }) => `Étape ${value} sur 5` }}>
 *   <Progress.Label>Inscription</Progress.Label>
 *   <Progress.ValueText>{({ value }) => `${value} / 5`}</Progress.ValueText>
 *   <Progress.Track>
 *     <Progress.Range />
 *   </Progress.Track>
 * </Progress.Root>
 */
export function ProgressRoot(props: ProgressRootProps): Element {
  return (
    <ProgressLookContext value={lookOf(props)}>
      <Seed.Root
        {...omit(props, "class", "tone", "segmented")}
        class={root({ tone: props.tone, class: props.class })}
      />
    </ProgressLookContext>
  )
}

/** The look the root's props ask for, read by its parts */
export function lookOf(props: { tone?: ProgressTone | undefined; segmented?: boolean | undefined }): ProgressLook {
  return { tone: () => props.tone ?? "primary", segmented: () => props.segmented ?? false }
}

export const root = tv({
  extend: toneColors,
  base: "grid w-full grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2",
})

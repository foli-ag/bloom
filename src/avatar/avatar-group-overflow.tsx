import type { JSX } from "@solidjs/web"
import type { Element } from "solid-js"
import { tv } from "../internal/variants.js"
import { avatarTile, entry, useAvatarGroup, type AvatarShape, type AvatarSize } from "./avatar-look.js"

export interface AvatarGroupOverflowProps {
  /** What shows, such as "+3" */
  children: JSX.Element
  /** What a screen reader says instead, such as "3 autres personnes" */
  alt: string
  /** The group's size unless set here */
  size?: AvatarSize | undefined
  /** A square for a group of organisations */
  shape?: AvatarShape | undefined
  class?: string | undefined
}

/**
 * The last entry of an `AvatarGroup`, saying how many people are left out, "+3", in the app's words. It is drawn as an
 * avatar in gray, so it does not read as someone's initials, and a screen reader says `alt` and not "plus 3".
 */
export function AvatarGroupOverflow(props: AvatarGroupOverflowProps): Element {
  const group = useAvatarGroup()
  return (
    <li class={entry()}>
      <span
        class={overflow({
          size: props.size ?? group?.size(),
          shape: props.shape,
          grouped: group !== null,
          class: props.class,
        })}
      >
        <span class="sr-only">{props.alt}</span>
        <span aria-hidden="true">{props.children}</span>
      </span>
    </li>
  )
}

const overflow = tv({
  extend: avatarTile,
  base: "bg-neutral-soft font-semibold tracking-body text-ink tabular-nums",
})

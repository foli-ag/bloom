import type { JSX } from "@solidjs/web"
import { omit, type Element } from "solid-js"
import { tv } from "../internal/variants.js"
import { AvatarGroupContext, type AvatarSize } from "./avatar-look.js"

export interface AvatarGroupProps extends Omit<JSX.HTMLAttributes<HTMLUListElement>, "class" | "children"> {
  /** The size of every avatar in it, 48px by default */
  size?: AvatarSize | undefined
  /** The avatars, then an `AvatarGroup.Overflow` for those left out, "+3" */
  children: JSX.Element
  /** What the people have in common, such as "Équipe de la parcelle", for a screen reader */
  "aria-label"?: string | undefined
  class?: string | undefined
}

/**
 * Several people at a glance, their avatars overlapping in a row, such as those who work a parcel. Each avatar keeps
 * its own name, and the group is a list of them: a screen reader says how many there are and reads the names in the
 * order they show, from the first, then the overflow's words. A single picture named by the app would need those names
 * written again in one sentence, and could not hold an avatar that is a link to someone's page; a list can.
 *
 * The first avatar sits on top and each next one tucks under it by a quarter of its width, ringed in the page's color
 * so the faces stay apart. On a card, set `--avatar-ring` to the card's color: `class="[--avatar-ring:var(--color-raised)]"`.
 * Show a few and say how many more with `AvatarGroup.Overflow`, whose words are the app's.
 *
 * @example
 * <AvatarGroup aria-label="Équipe de la parcelle">
 *   <Avatar src="/photos/marie.jpg" alt="Marie Dupont">MD</Avatar>
 *   <Avatar alt="Jean Martin">JM</Avatar>
 *   <Avatar shape="square" alt="CUMA du Val">CV</Avatar>
 *   <AvatarGroup.Overflow alt="3 autres personnes">+3</AvatarGroup.Overflow>
 * </AvatarGroup>
 */
export function AvatarGroupRoot(props: AvatarGroupProps): Element {
  return (
    <AvatarGroupContext value={{ size: () => props.size }}>
      {/* `role="list"`: Safari drops the role of a list without markers */}
      <ul role="list" {...omit(props, "size", "class")} class={group({ size: props.size, class: props.class })} />
    </AvatarGroupContext>
  )
}

const group = tv({
  base: "flex items-center [--avatar-ring:var(--color-surface)]",
  variants: {
    size: {
      sm: "[--avatar-overlap:0.625rem]",
      md: "[--avatar-overlap:0.75rem]",
      lg: "[--avatar-overlap:1rem]",
    },
  },
  defaultVariants: { size: "md" },
})

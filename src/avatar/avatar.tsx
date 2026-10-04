import { Avatar as Seed } from "@foliag/seeds/avatar"
import type { JSX } from "@solidjs/web"
import { createEffect, createSignal, omit, Show, type Element } from "solid-js"
import { tv } from "../internal/variants.js"
import { avatarTile, entry, useAvatarGroup, type AvatarShape, type AvatarSize } from "./avatar-look.js"

export type AvatarProps = Omit<Seed.RootProps, "children" | "class"> & {
  /** 40, 48 or 64px. In an `AvatarGroup` it is the group's unless set here. */
  size?: AvatarSize | undefined
  /** A circle for a person, a square with rounded corners for an organisation, a farm or a cooperative */
  shape?: AvatarShape | undefined
  /** The photo. Without one, or when it does not load, the children show instead. */
  src?: string | undefined
  /** Who this is, as a screen reader says it. The picture is announced once, under this name, and the children are not read. */
  alt: string
  /** What shows until the photo loads, and when there is none or it fails: initials, such as "MD". */
  children: JSX.Element
  /** Merged after the component's own classes, and wins over them */
  class?: string | undefined
}

/**
 * A person or a field's photo in a circle, with its initials as the fallback. A poor connection leaves the photo
 * loading or failed, so the initials are always laid out and take its place without the page moving.
 *
 * The photo fades in over the initials once it has loaded while they fade out under it, so the circle is never empty
 * for a frame and nothing cuts. A photo already in the browser's cache shows at once, and one that fails leaves the
 * initials as they are.
 *
 * `shape="square"` is for an organisation, with the same photo and initials. In an `AvatarGroup` it is one entry of the
 * group's list, ringed in the page's color where it overlaps the one before it.
 *
 * @example
 * <Avatar src="/photos/marie.jpg" alt="Marie Dupont">MD</Avatar>
 * <Avatar shape="square" src="/logos/cuma.png" alt="CUMA du Val">CV</Avatar>
 */
export function Avatar(props: AvatarProps): Element {
  const rest = omit(props, "src", "alt", "size", "shape", "children", "class")
  const group = useAvatarGroup()
  // A photo the browser already holds is complete as soon as its address is set, before zag has looked at it. It is
  // shown at once, where zag would show the initials for a frame and the photo would then fade in over them.
  let photo: HTMLImageElement | undefined
  const [cached, setCached] = createSignal(false)
  createEffect(
    () => props.src,
    () => {
      setCached(!!photo?.complete && photo.naturalWidth > 0)
    },
  )
  const picture = (
    <Seed.Root
      {...rest}
      role="img"
      aria-label={props.alt}
      data-cached={cached() ? "" : undefined}
      class={avatar({
        size: props.size ?? group?.size(),
        shape: props.shape,
        grouped: group !== null,
        class: props.class,
      })}
    >
      {/* Zag hides the part it is not showing, which would cut from one to the other. Both stay laid out, and fade. */}
      <Seed.Fallback aria-hidden="true" hidden={false} class={fallback()}>
        {props.children}
      </Seed.Fallback>
      {/* The root names the picture, so the image inside is decoration */}
      <Seed.Image ref={(element) => (photo = element)} src={props.src} alt="" hidden={false} class={image()} />
    </Seed.Root>
  )
  // In a group it is an entry of the group's list
  return (
    <Show when={group} fallback={picture}>
      <li class={entry()}>{picture}</li>
    </Show>
  )
}

// The initials fade out on the photo's clock, under it, so that no ghost of them shows through it as it settles
const fallback = tv({
  base: [
    "font-semibold tracking-body uppercase",
    "transition-opacity duration-(--duration-smooth) ease-smooth data-[state=hidden]:opacity-0",
    "group-data-cached/avatar:opacity-0 group-data-cached/avatar:transition-none",
  ],
})

const image = tv({
  base: [
    "absolute inset-0 size-full object-cover opacity-0",
    "transition-opacity duration-(--duration-exit) ease-smooth",
    "data-[state=visible]:opacity-100 data-[state=visible]:duration-(--duration-smooth)",
    "group-data-cached/avatar:opacity-100 group-data-cached/avatar:transition-none",
  ],
})

const avatar = tv({
  extend: avatarTile,
  base: "group/avatar bg-primary-soft text-primary-text",
})

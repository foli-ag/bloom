import { createContext, useContext } from "solid-js"
import { tv } from "tailwind-variants"

export type AvatarSize = "sm" | "md" | "lg"
export type AvatarShape = "circle" | "square"

/** The group an avatar sits in, if any: the size its avatars take unless they set their own */
export interface AvatarGroupLook {
  size: () => AvatarSize | undefined
}

export const AvatarGroupContext = /* @__PURE__ */ createContext<AvatarGroupLook | null>(null)

export const useAvatarGroup = () => useContext(AvatarGroupContext)

/**
 * The tile an avatar or a group's overflow is drawn on. A person is a circle; an organisation, a farm or a cooperative,
 * is a square with rounded corners, a quarter of its side, so it reads as a logo at any size. In a group each one is
 * ringed in the page's color (`--avatar-ring`), so where two overlap there is a gap between them and no shared edge.
 *
 * No colored ring: on a picture that nobody presses, a green edge would read as a status, "online" or "selected". A
 * hairline drawn over it keeps a light photo from melting into the page, and follows the shape.
 */
export const avatarTile = tv({
  base: [
    "relative inline-flex shrink-0 items-center justify-center overflow-hidden select-none",
    "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:border after:border-ink/15",
  ],
  variants: {
    size: {
      sm: "size-10 text-sm",
      md: "size-12 text-base",
      lg: "size-16 text-xl",
    },
    shape: {
      circle: "rounded-full",
      square: "rounded-[25%]",
    },
    grouped: {
      true: "ring-2 ring-(--avatar-ring)",
      false: "",
    },
  },
  defaultVariants: { size: "md", shape: "circle", grouped: false },
})

/**
 * An entry of an `AvatarGroup`: it tucks under the one before it by a quarter of its width (`--avatar-overlap`), and
 * sits under it too, so the first face shows whole and each next one peeks out from behind. The order of the list is
 * the order on screen, and a screen reader reads it from the first. Where `sibling-index()` is not known, the later
 * avatars sit on top instead, still apart by their ring.
 */
export const entry = tv({
  base: "flex shrink-0 not-first:-ms-(--avatar-overlap) z-[calc(100_-_sibling-index())]",
})

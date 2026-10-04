import type { Avatar as Seed } from "@foliag/seeds/avatar"
import { AvatarGroupOverflow } from "./avatar-group-overflow.jsx"
import { AvatarGroupRoot } from "./avatar-group.jsx"

export { Avatar, type AvatarProps } from "./avatar.jsx"
export type { AvatarGroupProps } from "./avatar-group.jsx"
export type { AvatarGroupOverflowProps } from "./avatar-group-overflow.jsx"
export type { AvatarShape, AvatarSize } from "./avatar-look.js"

export type StatusChangeDetails = Seed.StatusChangeDetails

/** Avatars overlapping in a row, as a list, with `AvatarGroup.Overflow` for those left out */
export const AvatarGroup = /* @__PURE__ */ Object.assign(AvatarGroupRoot, { Overflow: AvatarGroupOverflow })

import { cn } from "cn"
import { tv as joinVariants } from "tailwind-variants/lite"

export type { VariantProps } from "tailwind-variants/lite"

/**
 * The lite `tv`, which only joins classes, with `cn` merging what it joins: a compound variant wins over the base it
 * conflicts with, and an app's `class` wins over both. The full `tv` carries its own copy of `tailwind-merge`, which
 * `cn` replaces. The component keeps the parts `tv` hangs on it, so another `tv` can still `extend` it.
 */
export const tv = ((options) => {
  const join = joinVariants(options)
  return Object.assign((props?: Parameters<typeof join>[0]) => cn(join(props)), join)
}) as typeof joinVariants

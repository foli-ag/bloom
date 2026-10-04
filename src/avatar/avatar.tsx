import { Avatar as Seed } from "@foliag/seeds/avatar"
import type { JSX } from "@solidjs/web"
import { omit, type Element } from "solid-js"
import { tv, type VariantProps } from "tailwind-variants"

export type AvatarProps = Omit<Seed.RootProps, "children" | "class"> &
  VariantProps<typeof avatar> & {
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
 * @example
 * <Avatar src="/photos/marie.jpg" alt="Marie Dupont">MD</Avatar>
 */
export function Avatar(props: AvatarProps): Element {
  const rest = omit(props, "src", "alt", "size", "children", "class")
  return (
    <Seed.Root {...rest} role="img" aria-label={props.alt} class={avatar({ size: props.size, class: props.class })}>
      <Seed.Fallback aria-hidden="true" class="font-semibold tracking-body uppercase">
        {props.children}
      </Seed.Fallback>
      {/* The root names the picture, so the image inside is decoration */}
      <Seed.Image src={props.src} alt="" class="size-full object-cover" />
    </Seed.Root>
  )
}

// No colored ring: on a picture that nobody presses, a green edge would read as a status, "online" or "selected". A
// hairline drawn over the photo keeps a light one from melting into the page.
const avatar = tv({
  base: [
    "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full select-none",
    "bg-primary-soft text-primary-text",
    "after:pointer-events-none after:absolute after:inset-0 after:rounded-full after:border after:border-ink/15",
  ],
  variants: {
    size: {
      sm: "size-10 text-sm",
      md: "size-12 text-base",
      lg: "size-16 text-xl",
    },
  },
  defaultVariants: { size: "md" },
})

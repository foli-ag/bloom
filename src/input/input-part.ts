import { tv } from "tailwind-variants"

/**
 * `Input.Start` and `Input.End`, placed by `order` so the app can write them in any order, on logical sides that swap in
 * a right-to-left page. A mark or a unit is muted, which keeps 7:1 for text and 3:1 for a mark, and greys with the
 * field. A button sits flush in the box's end, as tall as the box with its edge and its 48px kept, its ground clipped
 * inside its own clear edge so the box's edge still shows round it.
 */
export const inputPart = tv({
  base: [
    "flex shrink-0 items-center gap-2 text-muted",
    "group-has-[>input:disabled]/field:text-disabled-ink",
    "has-[>button]:-my-0.5 has-[>button]:items-stretch [&>button]:bg-clip-padding",
  ],
  variants: {
    side: {
      start: "order-first ps-4 has-[>button]:-ms-0.5 has-[>button]:ps-0",
      end: "order-last pe-4 has-[>button]:-me-0.5 has-[>button]:pe-0",
    },
  },
})

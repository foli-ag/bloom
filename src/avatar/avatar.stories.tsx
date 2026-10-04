import { expect, fn, waitFor, within } from "storybook/test"
import type { Meta, StoryObj } from "storybook-solidjs-vite"
import { Avatar } from "./index.js"

// A photo as a data URI, so the story does not wait for a network, which is the situation it is about
const photo = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#a9d28f"/><circle cx="32" cy="26" r="11" fill="#2f5a1c"/><path d="M10 64c2-16 12-22 22-22s20 6 22 22z" fill="#2f5a1c"/></svg>',
)}`

const meta = {
  title: "Components/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  args: { alt: "Marie Dupont", children: "MD", onStatusChange: fn() },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

/**
 * The picture is announced once, as "Marie Dupont", and the initials under it are not read out. When the photo has
 * loaded it takes the initials' place.
 */
export const Photo: Story = {
  args: { src: photo },
  play: async ({ canvasElement, args }) => {
    const avatar = within(canvasElement).getByRole("img", { name: "Marie Dupont" })
    await waitFor(() => expect(args.onStatusChange).toHaveBeenCalledWith({ status: "loaded" }))
    expect(avatar.querySelector("[data-part=image]")).toBeVisible()
    expect(avatar.querySelector("[data-part=fallback]")).not.toBeVisible()
  },
}

/** A photo that does not load, as on a poor connection, leaves the initials in place. */
export const PhotoThatFails: Story = {
  args: { src: "data:image/png;base64,broken" },
  play: async ({ canvasElement, args }) => {
    const avatar = within(canvasElement).getByRole("img", { name: "Marie Dupont" })
    await waitFor(() => expect(args.onStatusChange).toHaveBeenCalledWith({ status: "error" }))
    expect(avatar.querySelector("[data-part=fallback]")).toBeVisible()
    expect(avatar).toHaveTextContent("MD")
  },
}

export const Initials: Story = {
  play: ({ canvasElement }) => {
    expect(within(canvasElement).getByRole("img", { name: "Marie Dupont" })).toHaveTextContent("MD")
  },
}

export const Sizes: Story = {
  render: (args) => (
    <div class="flex items-center gap-4">
      <Avatar {...args} size="sm" />
      <Avatar {...args} size="md" />
      <Avatar {...args} size="lg" src={photo} />
    </div>
  ),
}

export const InDarkTheme: Story = {
  globals: { theme: "dark" },
}

export const WithMoreContrast: Story = {
  globals: { contrast: "more" },
}

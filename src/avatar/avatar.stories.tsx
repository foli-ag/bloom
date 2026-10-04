import { expect, fn, waitFor, within } from "storybook/test"
import type { Meta, StoryObj } from "storybook-solidjs-vite"
import { Avatar, AvatarGroup } from "./index.js"

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
 * A person's initials in a circle, which their photo replaces once it has loaded. Its props are in the Controls panel:
 * give `src` the address of a photo.
 */
export const Playground: Story = {
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    shape: { control: "inline-radio", options: ["circle", "square"] },
    src: { control: "text" },
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

/**
 * The picture is announced once, as "Marie Dupont", and the initials under it are not read out. When the photo has
 * loaded it fades in over the initials, which go once it covers them.
 */
export const TestPhotoReplacesTheInitials: Story = {
  name: "Test: Photo replaces the initials",
  args: { src: photo },
  play: async ({ canvasElement, args }) => {
    const avatar = within(canvasElement).getByRole("img", { name: "Marie Dupont" })
    await waitFor(() => expect(args.onStatusChange).toHaveBeenCalledWith({ status: "loaded" }))
    await waitFor(() => expect(avatar.querySelector("[data-part=image]")).toBeVisible())
    await waitFor(() => expect(avatar.querySelector("[data-part=fallback]")).not.toBeVisible())
  },
}

/** A photo that does not load, as on a poor connection, leaves the initials in place. */
export const TestPhotoThatFails: Story = {
  name: "Test: Photo that fails",
  args: { src: "data:image/png;base64,broken" },
  play: async ({ canvasElement, args }) => {
    const avatar = within(canvasElement).getByRole("img", { name: "Marie Dupont" })
    await waitFor(() => expect(args.onStatusChange).toHaveBeenCalledWith({ status: "error" }))
    expect(avatar.querySelector("[data-part=fallback]")).toBeVisible()
    expect(avatar).toHaveTextContent("MD")
  },
}

export const TestInitials: Story = {
  name: "Test: Initials",
  play: ({ canvasElement }) => {
    expect(within(canvasElement).getByRole("img", { name: "Marie Dupont" })).toHaveTextContent("MD")
  },
}

export const TestInDarkTheme: Story = {
  name: "Test: In dark theme",
  globals: { theme: "dark" },
}

export const TestWithMoreContrast: Story = {
  name: "Test: With more contrast",
  globals: { contrast: "more" },
}

// An organisation's logo as a data URI: a tractor wheel on green
const logo = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#2f5a1c"/><circle cx="32" cy="32" r="16" fill="none" stroke="#e3f2d4" stroke-width="6"/><circle cx="32" cy="32" r="4" fill="#e3f2d4"/></svg>',
)}`

/** An organisation, a farm or a cooperative, as a square: its initials, which its logo replaces once loaded */
export const Square: Story = {
  args: { shape: "square", alt: "CUMA du Val", children: "CV" },
  render: (args) => (
    <div class="flex items-center gap-4">
      <Avatar {...args} size="sm" />
      <Avatar {...args} size="md" />
      <Avatar {...args} size="lg" src={logo} />
    </div>
  ),
}

function Team(props: { size?: "sm" | "md" | "lg" }) {
  return (
    <AvatarGroup aria-label="Équipe de la parcelle" size={props.size}>
      <Avatar src={photo} alt="Marie Dupont">
        MD
      </Avatar>
      <Avatar alt="Jean Martin">JM</Avatar>
      <Avatar shape="square" src={logo} alt="CUMA du Val">
        CV
      </Avatar>
      <Avatar alt="Léa Bernard">LB</Avatar>
      <AvatarGroup.Overflow alt="3 autres personnes">+3</AvatarGroup.Overflow>
    </AvatarGroup>
  )
}

/**
 * The people of a parcel at a glance: overlapping, the first on top, each ringed in the page's color, and "+3" for those
 * left out, in the app's words
 */
export const Group: Story = {
  render: () => (
    <div class="grid gap-6">
      <Team size="sm" />
      <Team />
      <Team size="lg" />
    </div>
  ),
}

/**
 * The group is a list, named by the app: a screen reader says how many there are and reads each name in the order they
 * show, then "3 autres personnes" for the "+3", which is not read as it shows
 */
export const TestGroupIsAList: Story = {
  name: "Test: Group is a list",
  render: () => <Team />,
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const list = canvas.getByRole("list", { name: "Équipe de la parcelle" })
    const entries = within(list).getAllByRole("listitem")
    expect(entries).toHaveLength(5)
    expect(entries.slice(0, 4).map((entry) => within(entry).getByRole("img").getAttribute("aria-label"))).toEqual([
      "Marie Dupont",
      "Jean Martin",
      "CUMA du Val",
      "Léa Bernard",
    ])
    expect(entries[4]).toHaveTextContent("3 autres personnes")
    expect(within(entries[4]!).getByText("+3")).toHaveAttribute("aria-hidden", "true")
    // In the order they show, from the start, each tucked under the one before it
    const boxes = entries.map((entry) => entry.getBoundingClientRect())
    for (let index = 1; index < boxes.length; index++) {
      expect(boxes[index]!.left).toBeGreaterThan(boxes[index - 1]!.left)
      expect(boxes[index]!.left).toBeLessThan(boxes[index - 1]!.right)
      expect(Number(getComputedStyle(entries[index]!).zIndex)).toBeLessThan(
        Number(getComputedStyle(entries[index - 1]!).zIndex),
      )
    }
  },
}

/** A square keeps the cross-fade: its logo fades in over the initials, which go once it covers them */
export const TestSquareLogoReplacesTheInitials: Story = {
  name: "Test: Square logo replaces the initials",
  args: { shape: "square", alt: "CUMA du Val", children: "CV", src: logo },
  play: async ({ canvasElement, args }) => {
    const avatar = within(canvasElement).getByRole("img", { name: "CUMA du Val" })
    expect(getComputedStyle(avatar).borderRadius).toBe("25%")
    await waitFor(() => expect(args.onStatusChange).toHaveBeenCalledWith({ status: "loaded" }))
    await waitFor(() => expect(avatar.querySelector("[data-part=image]")).toBeVisible())
    await waitFor(() => expect(avatar.querySelector("[data-part=fallback]")).not.toBeVisible())
  },
}

export const TestGroupInDarkTheme: Story = {
  name: "Test: Group in dark theme",
  render: () => <Team />,
  globals: { theme: "dark" },
}

export const TestGroupWithMoreContrast: Story = {
  name: "Test: Group with more contrast",
  render: () => <Team />,
  globals: { contrast: "more" },
}

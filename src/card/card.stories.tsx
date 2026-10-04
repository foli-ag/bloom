import { For } from "solid-js"
import { expect, fn, userEvent, within } from "storybook/test"
import type { Meta, StoryObj } from "storybook-solidjs-vite"
import { Badge } from "../badge/index.js"
import { Button } from "../button/index.js"
import { settled } from "../foundations/settled.js"
import { Card } from "./index.js"

// A field seen from above: stripes of crop, drawn inline so nothing is fetched
const photo =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 160"><rect width="320" height="160" fill="#8fbf5f"/>${Array.from(
      { length: 12 },
      (_, index) =>
        `<rect x="${index * 28 - 20}" y="-20" width="14" height="220" fill="#6e9f45" transform="rotate(18 160 80)"/>`,
    ).join("")}</svg>`,
  )

function Field(props: Partial<Card.RootProps>) {
  return (
    <Card.Root {...props} class="w-80">
      <Card.Header>
        <Card.Title>Les Grands Champs</Card.Title>
        <Card.Description>Blé tendre, 12,4 ha</Card.Description>
        <Badge tone="success" indicator="mark">
          Semé
        </Badge>
      </Card.Header>
      <Card.Body>Semé le 12 octobre, levée régulière sur toute la parcelle.</Card.Body>
      <Card.Actions>
        <Button tone="neutral" variant="outline">
          Modifier
        </Button>
        <Button>Ajouter une intervention</Button>
      </Card.Actions>
    </Card.Root>
  )
}

function FieldLink(props: Partial<Card.RootProps<"a">>) {
  return (
    <Card.Root as="a" href="#les-grands-champs" {...props} class="w-80">
      <Card.Header>
        <Card.Title>Les Grands Champs</Card.Title>
        <Card.Description>Blé tendre, 12,4 ha</Card.Description>
        <Badge tone="success" indicator="mark">
          Semé
        </Badge>
      </Card.Header>
      <Card.Body>Semé le 12 octobre, levée régulière.</Card.Body>
    </Card.Root>
  )
}

const meta = {
  title: "Components/Card",
  component: Field,
  tags: ["autodocs"],
  args: { variant: "outline" },
} satisfies Meta<typeof Field>

export default meta
type Story = StoryObj<typeof meta>

/** A card that holds one field: its name, a status, a line about it and two actions. Its props are in the Controls panel. */
export const Playground: Story = {
  argTypes: {
    variant: { control: "inline-radio", options: ["outline", "elevated", "soft"] },
  },
}

/** The three looks side by side: an edge, a shadow, a tint */
export const Variants: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div class="flex flex-wrap gap-4">
      <For each={["outline", "elevated", "soft"] as const}>
        {(variant) => (
          <Card.Root variant={variant} class="w-64">
            <Card.Header>
              <Card.Title>{variant}</Card.Title>
              <Card.Description>Blé tendre, 12,4 ha</Card.Description>
            </Card.Header>
            <Card.Body>Semé le 12 octobre.</Card.Body>
          </Card.Root>
        )}
      </For>
    </div>
  ),
}

/**
 * The whole card is a link: its edge is strong, as a finger has to find it, it goes down a little under the finger,
 * and an elevated one lifts under the pointer.
 */
export const AsALink: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div class="flex flex-wrap gap-4">
      <For each={["outline", "elevated", "soft"] as const}>{(variant) => <FieldLink variant={variant} />}</For>
    </div>
  ),
}

/** A photo that runs to the card's edges and takes its corners */
export const WithMedia: Story = {
  render: () => (
    <Card.Root as="a" href="#les-grands-champs" class="w-80">
      <Card.Media>
        <img src={photo} alt="Vue du ciel des Grands Champs" class="aspect-[2/1] object-cover" />
      </Card.Media>
      <Card.Header>
        <Card.Title>Les Grands Champs</Card.Title>
        <Card.Description>Blé tendre, 12,4 ha</Card.Description>
      </Card.Header>
    </Card.Root>
  ),
}

/** A list of cards, each a link, as a phone shows them */
export const AList: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <ul class="grid max-w-md gap-3">
      <For
        each={
          [
            ["Les Grands Champs", "Blé tendre, 12,4 ha", "success", "Semé"],
            ["La Combe", "Colza, 8 ha", "warning", "En retard"],
            ["Le Moulin", "Maïs grain, 21 ha", "neutral", "À semer"],
          ] as const
        }
      >
        {([name, crop, tone, status]) => (
          <li class="grid">
            <Card.Root as="a" href={`#${name}`}>
              <Card.Header>
                <Card.Title>{name}</Card.Title>
                <Card.Description>{crop}</Card.Description>
                <Badge tone={tone} indicator="mark">
                  {status}
                </Badge>
              </Card.Header>
            </Card.Root>
          </li>
        )}
      </For>
    </ul>
  ),
}

/**
 * A card that is a link is named by its title and described by its description, so a screen reader says "Les Grands
 * Champs, lien" and not every word inside. Its edge is the strong one, 3:1 against the page.
 */
export const TestALinkIsNamedByItsTitle: Story = {
  name: "Test: A link is named by its title",
  render: () => <FieldLink />,
  play: ({ canvasElement }) => {
    const link = within(canvasElement).getByRole("link", { name: "Les Grands Champs" })
    expect(link).toHaveAccessibleDescription("Blé tendre, 12,4 ha")
    expect(getComputedStyle(link).borderTopColor).toBe(getComputedStyle(probe("--color-strong")).color)
  },
}

/** A card that only holds content is not named after its title: it is no landmark, and its edge is the quiet one */
export const TestAPlainCardIsNoTarget: Story = {
  name: "Test: A plain card is no target",
  play: ({ canvasElement }) => {
    const card = canvasElement.querySelector<HTMLElement>("[data-scope=card][data-part=root]")!
    expect(card).not.toHaveAttribute("aria-labelledby")
    expect(getComputedStyle(card).borderTopColor).toBe(getComputedStyle(probe("--color-border")).color)
    expect(within(canvasElement).getByRole("heading", { level: 3, name: "Les Grands Champs" })).toBeVisible()
  },
}

/**
 * A card that is a button holds phrasing content only, so its title is a span, and Enter presses it. Its ring is drawn
 * inside its edge.
 */
export const TestAsAButton: Story = {
  name: "Test: As a button",
  render: () => (
    <Card.Root as="button" onClick={() => pressCard()} class="w-80">
      <Card.Header>
        <Card.Title>Ajouter une parcelle</Card.Title>
        <Card.Description>Dessinez-la sur la carte ou importez-la</Card.Description>
      </Card.Header>
    </Card.Root>
  ),
  play: async ({ canvasElement }) => {
    pressCard.mockClear()
    const button = within(canvasElement).getByRole("button", { name: "Ajouter une parcelle" })
    expect(button).toHaveAccessibleDescription("Dessinez-la sur la carte ou importez-la")
    expect(button.querySelector("h3, p, div")).toBeNull()
    await userEvent.tab()
    expect(button).toHaveFocus()
    const style = getComputedStyle(button)
    expect(Number.parseFloat(style.outlineOffset) + Number.parseFloat(style.outlineWidth)).toBeLessThanOrEqual(0)
    await userEvent.keyboard("{Enter}")
    expect(pressCard).toHaveBeenCalledOnce()
  },
}

/** A photo first in the card runs to its edges: its top is the card's, less the 2px edge */
export const TestMediaRunsToTheEdges: Story = {
  ...WithMedia,
  name: "Test: Media runs to the edges",
  play: async ({ canvasElement }) => {
    await settled()
    const card = canvasElement.querySelector<HTMLElement>("[data-part=root]")!.getBoundingClientRect()
    const image = canvasElement.querySelector("img")!.getBoundingClientRect()
    expect(image.top - card.top).toBeCloseTo(2, 0)
    expect(image.left - card.left).toBeCloseTo(2, 0)
    expect(card.right - image.right).toBeCloseTo(2, 0)
  },
}

export const TestVariantsInDarkTheme: Story = {
  ...AsALink,
  name: "Test: Variants in dark theme",
  globals: { theme: "dark" },
}

export const TestVariantsWithMoreContrast: Story = {
  ...AsALink,
  name: "Test: Variants with more contrast",
  globals: { contrast: "more" },
}

/** On a phone the buttons share the row and fill it */
export const TestOnAPhone: Story = {
  name: "Test: On a phone",
  globals: { viewport: { value: "mobile2", isRotated: false } },
  play: ({ canvasElement }) => {
    const [first, second] = within(canvasElement).getAllByRole("button")
    const actions = first!.parentElement!.getBoundingClientRect()
    expect(first!.getBoundingClientRect().left).toBeCloseTo(actions.left, 0)
    expect(second!.getBoundingClientRect().right).toBeCloseTo(actions.right, 0)
  },
}

const pressCard = fn()

function probe(token: string) {
  const element = document.createElement("span")
  element.style.color = `var(${token})`
  document.body.append(element)
  queueMicrotask(() => element.remove())
  return element
}

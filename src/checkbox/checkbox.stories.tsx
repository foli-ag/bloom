import { createSignal, For } from "solid-js"
import { expect, fn, userEvent, waitFor, within } from "storybook/test"
import type { Meta, StoryObj } from "storybook-solidjs-vite"
import { Checkbox } from "./index.js"

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  args: { children: "Irrigué", onCheckedChange: fn() },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

/**
 * The whole row is the target, 48px tall: tapping the words ticks the box, and so does Space on the focused box.
 * Its props are in the Controls panel.
 */
export const Playground: Story = {
  argTypes: {
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    invalid: { control: "boolean" },
    required: { control: "boolean" },
    variant: { control: "inline-radio", options: ["row", "card"] },
    name: { control: "text" },
  },
}

export const Checked: Story = {
  args: { defaultChecked: true },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const DisabledAndChecked: Story = {
  args: { disabled: true, defaultChecked: true },
}

/** Say why in text next to the box, as for an input. The box gets a second line on its edge, and no color alone. */
export const Invalid: Story = {
  args: { invalid: true, children: "J'accepte les conditions de la coopérative" },
}

/** A list stays in step: each row is its own target, with no gap between rows to miss. */
export const Group: Story = {
  render: () => <ParcelGroup />,
  parameters: { layout: "padded" },
}

/** A sentence under the title says what the choice means. It is muted, at 7:1, and read out after the box's name. */
export const WithDescription: Story = {
  render: (args) => (
    <div class="w-96">
      <Checkbox {...args}>
        <Checkbox.Label>Agriculture biologique</Checkbox.Label>
        <Checkbox.Description>Sans produit de synthèse depuis trois ans</Checkbox.Description>
      </Checkbox>
    </div>
  ),
}

/**
 * Tiles, for choices that deserve more than a line: a mark, a title and a sentence. The whole tile is the target, and a
 * ticked one shows by its box in the corner, its thicker green edge and its tint. The app lays them in a grid that
 * becomes one column on a phone.
 */
export const Cards: Story = {
  render: () => <Practices />,
  parameters: { layout: "padded" },
}

/**
 * The whole row is the target, 48px tall: tapping the words ticks the box, and so does Space on the focused box.
 * Pressing shrinks the box at once, and releasing brings it back as the box fills and the tick draws in.
 */
export const TestTicksFromLabelAndSpace: Story = {
  name: "Test: Ticks from its label and Space",
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const box = canvas.getByRole("checkbox", { name: "Irrigué" })
    expect(box).not.toBeChecked()
    await userEvent.click(canvas.getByText("Irrigué"))
    expect(box).toBeChecked()
    expect(args.onCheckedChange).toHaveBeenLastCalledWith(expect.objectContaining({ checked: true }))
    await userEvent.keyboard(" ")
    expect(box).not.toBeChecked()
    expect(canvasElement.querySelector("[data-part=control]")).toHaveAttribute("data-state", "unchecked")
  },
}

/** The row is as wide as its container, so a thumb that lands well past the end of a short word still ticks the box. */
export const TestWholeRow: Story = {
  name: "Test: Whole row is the target",
  render: (args) => (
    <div class="w-80">
      <Checkbox {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const { right, top, height } = canvasElement.querySelector("div.w-80")!.getBoundingClientRect()
    await userEvent.click(document.elementFromPoint(right - 8, top + height / 2)!)
    expect(within(canvasElement).getByRole("checkbox", { name: "Irrigué" })).toBeChecked()
  },
}

/** A label that wraps keeps the box on its first line, where the reading starts. */
export const TestLongLabel: Story = {
  name: "Test: Long label wraps",
  args: { children: "Je certifie que la parcelle n'a reçu aucun traitement dans les 21 jours avant la récolte" },
  render: (args) => (
    <div class="w-72">
      <Checkbox {...args} />
    </div>
  ),
  play: ({ canvasElement }) => {
    const box = canvasElement.querySelector("[data-part=control]")!.getBoundingClientRect()
    const label = canvasElement.querySelector("[data-part=control]")!.nextElementSibling!.getBoundingClientRect()
    expect(label.height).toBeGreaterThan(box.height * 2)
    expect(Math.abs(box.top - label.top)).toBeLessThanOrEqual(1)
  },
}

/** Reaching the box with the keyboard draws a 3px ring around it, offset so it clears the edge. */
export const TestKeyboardFocus: Story = {
  name: "Test: Keyboard focus",
  play: async ({ canvasElement }) => {
    await userEvent.tab()
    expect(within(canvasElement).getByRole("checkbox", { name: "Irrigué" })).toHaveFocus()
    expect(canvasElement.querySelector("[data-part=control]")).toHaveAttribute("data-focus-visible")
  },
}

/**
 * Unticked, the tick fades out, quicker than it came. Drawn back along its path instead, its round end would sit on the
 * box as a dot until the spring came to rest.
 */
export const TestUntickFadesOut: Story = {
  name: "Test: Unticked, the tick fades out",
  args: { defaultChecked: true },
  play: async ({ canvasElement }) => {
    const control = canvasElement.querySelector<HTMLElement>("[data-part=control]")!
    const tick = control.querySelector("path")!
    // How much of the tick shows: its opacity times that of everything up to the box
    const shown = () => {
      let alpha = 1
      for (let at: Element | null = tick; at && at !== control; at = at.parentElement) {
        alpha *= Number(getComputedStyle(at).opacity)
      }
      return alpha
    }
    await userEvent.click(within(canvasElement).getByText("Irrigué"))
    while (control.getAnimations({ subtree: true }).length > 0) {
      if (shown() > 0.05) expect(Number.parseFloat(getComputedStyle(tick).strokeDashoffset)).toBe(0)
      await frame()
    }
    expect(shown()).toBe(0)
  },
}

/** For a parent of a partly ticked group. The dash is read out as "mixed". */
export const TestIndeterminate: Story = {
  name: "Test: Indeterminate",
  args: { checked: "indeterminate", children: "Toutes les parcelles" },
  play: ({ canvasElement }) => {
    expect(within(canvasElement).getByRole("checkbox", { name: "Toutes les parcelles" })).toBePartiallyChecked()
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

/** A box described by its sentence is named by its title alone */
export const TestDescribed: Story = {
  ...WithDescription,
  name: "Test: Named by its title, described by its sentence",
  play: async ({ canvasElement }) => {
    const box = within(canvasElement).getByRole("checkbox", { name: "Agriculture biologique" })
    expect(box).toHaveAccessibleDescription("Sans produit de synthèse depuis trois ans")
    await userEvent.click(within(canvasElement).getByText("Sans produit de synthèse depuis trois ans"))
    expect(box).toBeChecked()
  },
}

/**
 * A tile is ticked by a tap anywhere on it and by Space, and the keyboard's ring is drawn on the tile, inside its edge,
 * and not on the small box
 */
export const TestCardsTickAndKeys: Story = {
  ...Cards,
  name: "Test: Tiles ticked by a tap anywhere and Space",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const haies = canvas.getByRole("checkbox", { name: "Haies" })
    expect(haies).toHaveAccessibleDescription("Abritent les auxiliaires et freinent le vent")
    const tile = haies.closest("label")!
    const { left, bottom } = tile.getBoundingClientRect()
    await userEvent.click(document.elementFromPoint(left + 12, bottom - 12)!)
    expect(haies).toBeChecked()
    await userEvent.keyboard(" ")
    expect(haies).not.toBeChecked()
    // A tap leaves no ring; Tab to the next tile draws it there
    expect(tile).not.toHaveAttribute("data-focus-visible")
    await userEvent.tab()
    const next = canvas.getByRole("checkbox", { name: "Couverts d'interculture" }).closest("label")!
    await waitFor(() => expect(next).toHaveAttribute("data-focus-visible"))
    const ring = getComputedStyle(next)
    expect(ring.outlineStyle).toBe("solid")
    expect(Number.parseFloat(ring.outlineOffset) + Number.parseFloat(ring.outlineWidth)).toBeLessThanOrEqual(0)
    expect(getComputedStyle(next.querySelector("[data-part=control]")!).outlineStyle).toBe("none")
  },
}

/** On a phone the tiles stack in one column */
export const TestCardsOnAPhone: Story = {
  ...Cards,
  name: "Test: Tiles on a phone",
  globals: { viewport: { value: "mobile2", isRotated: false } },
  play: ({ canvasElement }) => {
    const lefts = [...canvasElement.querySelectorAll("[data-part=root]")].map((tile) =>
      Math.round(tile.getBoundingClientRect().left),
    )
    expect(new Set(lefts).size).toBe(1)
  },
}

export const TestCardsInDarkTheme: Story = {
  ...Cards,
  name: "Test: Tiles in dark theme",
  globals: { theme: "dark" },
}

export const TestCardsWithMoreContrast: Story = {
  ...Cards,
  name: "Test: Tiles with more contrast",
  globals: { contrast: "more" },
}

export const TestDescribedInDarkTheme: Story = {
  ...WithDescription,
  name: "Test: Description in dark theme",
  globals: { theme: "dark" },
  args: { defaultChecked: true },
}

const practices = [
  {
    name: "haies",
    title: "Haies",
    text: "Abritent les auxiliaires et freinent le vent",
    mark: "M12 21v-6m-6 6v-4m12 4v-4M4 13a4 4 0 0 1 8-2 4 4 0 0 1 8 2Z",
  },
  {
    name: "couverts",
    title: "Couverts d'interculture",
    text: "Gardent le sol couvert entre deux cultures",
    mark: "M3 20h18M7 20v-5m5 5V9m5 11v-7",
  },
  {
    name: "bandes",
    title: "Bandes enherbées",
    text: "Retiennent la terre le long des cours d'eau",
    mark: "M3 16c3-2 6 2 9 0s6-2 9 0M3 11c3-2 6 2 9 0s6-2 9 0",
  },
] as const

function Practices() {
  return (
    <fieldset class="grid w-[min(48rem,calc(100vw-2rem))] gap-3 sm:grid-cols-[repeat(auto-fill,minmax(15rem,1fr))]">
      <legend class="mb-2 text-lg font-bold tracking-heading">Pratiques sur la ferme</legend>
      <For each={practices}>
        {(practice) => (
          <Checkbox variant="card" name={practice.name} defaultChecked={practice.name === "couverts"}>
            <Checkbox.Media>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d={practice.mark} />
              </svg>
            </Checkbox.Media>
            <Checkbox.Label>{practice.title}</Checkbox.Label>
            <Checkbox.Description>{practice.text}</Checkbox.Description>
          </Checkbox>
        )}
      </For>
    </fieldset>
  )
}

function frame() {
  return new Promise((resolve) => requestAnimationFrame(resolve))
}

const parcels = ["Les Œillets", "La Grande Pièce", "Champ du Moulin"] as const

function ParcelGroup() {
  const [chosen, setChosen] = createSignal(new Set<string>(["Les Œillets"]))
  const all = () => (chosen().size === parcels.length ? true : chosen().size === 0 ? false : "indeterminate")
  return (
    <fieldset class="grid w-80 gap-0">
      <legend class="mb-1 text-lg font-bold tracking-heading">Parcelles à traiter</legend>
      <Checkbox
        checked={all()}
        onCheckedChange={(details) => setChosen(new Set(details.checked === true ? parcels : []))}
      >
        Toutes les parcelles
      </Checkbox>
      <For each={parcels}>
        {(parcel) => (
          <Checkbox
            class="ms-8"
            checked={chosen().has(parcel)}
            onCheckedChange={(details) =>
              setChosen((current) => {
                const next = new Set(current)
                if (details.checked === true) next.add(parcel)
                else next.delete(parcel)
                return next
              })
            }
          >
            {parcel}
          </Checkbox>
        )}
      </For>
    </fieldset>
  )
}

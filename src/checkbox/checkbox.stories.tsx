import { createSignal, For } from "solid-js"
import { expect, fn, userEvent, within } from "storybook/test"
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
 * Pressing shrinks the box at once, and releasing brings it back as the box fills and the tick draws in.
 */
export const Default: Story = {
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
export const WholeRow: Story = {
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
export const LongLabel: Story = {
  args: { children: "Je certifie que la parcelle n'a reçu aucun traitement dans les 21 jours avant la récolte" },
  render: (args) => (
    <div class="w-72">
      <Checkbox {...args} />
    </div>
  ),
  play: ({ canvasElement }) => {
    const box = canvasElement.querySelector("[data-part=control]")!.getBoundingClientRect()
    const label = canvasElement.querySelector("[data-part=label]")!.getBoundingClientRect()
    expect(label.height).toBeGreaterThan(box.height * 2)
    expect(Math.abs(box.top - label.top)).toBeLessThanOrEqual(1)
  },
}

/** Reaching the box with the keyboard draws a 3px ring around it, offset so it clears the edge. */
export const KeyboardFocus: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.tab()
    expect(within(canvasElement).getByRole("checkbox", { name: "Irrigué" })).toHaveFocus()
    expect(canvasElement.querySelector("[data-part=control]")).toHaveAttribute("data-focus-visible")
  },
}

export const Checked: Story = {
  args: { defaultChecked: true },
}

/** For a parent of a partly ticked group. The dash is read out as "mixed". */
export const Indeterminate: Story = {
  args: { checked: "indeterminate", children: "Toutes les parcelles" },
  play: ({ canvasElement }) => {
    expect(within(canvasElement).getByRole("checkbox", { name: "Toutes les parcelles" })).toBePartiallyChecked()
  },
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

export const InDarkTheme: Story = {
  globals: { theme: "dark" },
}

export const WithMoreContrast: Story = {
  globals: { contrast: "more" },
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

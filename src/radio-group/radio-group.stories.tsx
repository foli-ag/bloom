import { createSignal, For, omit } from "solid-js"
import { expect, fn, userEvent, within } from "storybook/test"
import type { Meta, StoryObj } from "storybook-solidjs-vite"
import { RadioGroup } from "./index.js"

const crops = [
  { value: "ble", label: "Blé" },
  { value: "mais", label: "Maïs" },
  { value: "colza", label: "Colza" },
] as const

function Crops(props: RadioGroup.RootProps & { disabledCrop?: string | undefined }) {
  return (
    <RadioGroup.Root class="w-72" {...omit(props, "disabledCrop")}>
      <RadioGroup.Label>Culture</RadioGroup.Label>
      <For each={crops}>
        {(crop) => (
          <RadioGroup.Item value={crop.value} disabled={crop.value === props.disabledCrop}>
            {crop.label}
          </RadioGroup.Item>
        )}
      </For>
    </RadioGroup.Root>
  )
}

const meta = {
  title: "Components/RadioGroup",
  component: Crops,
  tags: ["autodocs"],
  args: { name: "culture", onValueChange: fn() },
} satisfies Meta<typeof Crops>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Tapping the words chooses a row, and the dot springs in. The arrow keys move the choice inside the group, and Tab
 * leaves it. The group is named by its label.
 */
export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    expect(canvas.getByRole("radiogroup", { name: "Culture" })).toBeVisible()
    await userEvent.click(canvas.getByText("Maïs"))
    expect(canvas.getByRole("radio", { name: "Maïs" })).toBeChecked()
    expect(args.onValueChange).toHaveBeenLastCalledWith({ value: "mais" })
    await userEvent.keyboard("{ArrowDown}")
    expect(canvas.getByRole("radio", { name: "Colza" })).toBeChecked()
    expect(canvas.getByRole("radio", { name: "Maïs" })).not.toBeChecked()
  },
}

export const Chosen: Story = {
  args: { defaultValue: "ble" },
}

export const Horizontal: Story = {
  args: { orientation: "horizontal", defaultValue: "ble", class: "w-auto" },
}

export const OneDisabled: Story = {
  args: { disabledCrop: "colza", defaultValue: "ble" },
}

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "ble" },
}

/** Say why in text, as for an input: the ring gets a second line, and no color alone. */
export const Invalid: Story = {
  args: { invalid: true },
}

/** Controlled by the app, which can refuse or reset a choice */
export const Controlled: Story = {
  render: () => <ControlledCrops />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByText("Colza"))
    expect(canvas.getByText("Choisi : colza")).toBeVisible()
  },
}

export const InDarkTheme: Story = {
  globals: { theme: "dark" },
  args: { defaultValue: "mais" },
}

export const WithMoreContrast: Story = {
  globals: { contrast: "more" },
  args: { defaultValue: "mais" },
}

function ControlledCrops() {
  const [crop, setCrop] = createSignal("ble")
  return (
    <div class="grid gap-2">
      <Crops value={crop()} onValueChange={(details) => setCrop(details.value ?? "")} />
      <p>Choisi : {crop()}</p>
    </div>
  )
}

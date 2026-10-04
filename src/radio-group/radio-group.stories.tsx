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
 * One choice among a few, all in view at once. Tapping the words chooses a row, and the dot springs in. Its props are
 * in the Controls panel.
 */
export const Playground: Story = {
  argTypes: {
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    invalid: { control: "boolean" },
    required: { control: "boolean" },
    orientation: { control: "inline-radio", options: ["horizontal", "vertical"] },
    name: { control: "text" },
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

/**
 * Tapping the words chooses a row, and the dot springs in. The arrow keys move the choice inside the group, and Tab
 * leaves it. The group is named by its label.
 */
export const TestChoosesWithTapAndArrowKeys: Story = {
  name: "Test: Chooses with a tap and the arrow keys",
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

/** Controlled by the app, which can refuse or reset a choice */
export const TestControlled: Story = {
  name: "Test: Controlled by the app",
  render: () => <ControlledCrops />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByText("Colza"))
    expect(canvas.getByText("Choisi : colza")).toBeVisible()
  },
}

export const TestInDarkTheme: Story = {
  name: "Test: In dark theme",
  globals: { theme: "dark" },
  args: { defaultValue: "mais" },
}

export const TestWithMoreContrast: Story = {
  name: "Test: With more contrast",
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

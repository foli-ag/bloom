import { createSignal, For, omit } from "solid-js"
import { expect, fn, userEvent, waitFor, within } from "storybook/test"
import type { Meta, StoryObj } from "storybook-solidjs-vite"
import { RadioGroup } from "./index.js"

const crops = [
  {
    value: "ble",
    label: "Blé",
    description: "Semé en octobre, récolté en juillet",
    mark: "M12 21V9m0 4-3-3m3 3 3-3m-3-1-3-3m3 3 3-3m-3-1V3",
  },
  {
    value: "mais",
    label: "Maïs",
    description: "Semé au printemps, il demande de l'eau en été",
    mark: "M12 21c-4-3-5-8-3-14 2 1 3 3 3 6 0-3 1-5 3-6 2 6 1 11-3 14Z",
  },
  {
    value: "colza",
    label: "Colza",
    description: "Ses fleurs jaunes nourrissent les abeilles en avril",
    mark: "M12 21v-7m0 0a3 3 0 1 1 3-3 3 3 0 1 1-3 3Zm0 0a3 3 0 1 1-3-3 3 3 0 1 1 3 3Z",
  },
] as const

type CropsProps = RadioGroup.RootProps & {
  disabledCrop?: string | undefined
  /** Shows each crop's sentence under its name */
  described?: boolean | undefined
}

/** A drawn mark for a tile, in the text color */
function CropMark(props: { d: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d={props.d} />
    </svg>
  )
}

function Crops(props: CropsProps) {
  return (
    <RadioGroup.Root
      class={props.variant === "card" ? "w-[min(48rem,calc(100vw-2rem))]" : "w-72"}
      {...omit(props, "disabledCrop", "described")}
    >
      <RadioGroup.Label>Culture</RadioGroup.Label>
      <For each={crops}>
        {(crop) => (
          <RadioGroup.Item value={crop.value} disabled={crop.value === props.disabledCrop}>
            {props.variant === "card" || props.described ? (
              <>
                {props.variant === "card" && (
                  <RadioGroup.Item.Media>
                    <CropMark d={crop.mark} />
                  </RadioGroup.Item.Media>
                )}
                <RadioGroup.Item.Text>{crop.label}</RadioGroup.Item.Text>
                <RadioGroup.Item.Description>{crop.description}</RadioGroup.Item.Description>
              </>
            ) : (
              crop.label
            )}
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
    variant: { control: "inline-radio", options: ["row", "card"] },
    described: { control: "boolean" },
    name: { control: "text" },
  },
}

/** A sentence under each choice says what it means. It is muted, at 7:1, and read out after the choice's name. */
export const WithDescriptions: Story = {
  args: { described: true, defaultValue: "ble", class: "w-96" },
}

/**
 * Tiles, for choices that deserve more than a line: a mark, a title and a sentence each. The whole tile is the target,
 * and the chosen one shows by its dot in the corner, its thicker green edge and its tint. They sit side by side in a
 * grid that becomes one column on a phone.
 */
export const Cards: Story = {
  args: { variant: "card", defaultValue: "mais" },
  parameters: { layout: "padded" },
}

/** Stacked tiles, one column whatever the width */
export const CardsStacked: Story = {
  args: { variant: "card", orientation: "vertical", defaultValue: "ble", class: "w-96" },
  parameters: { layout: "padded" },
}

export const CardsWithOneDisabled: Story = {
  args: { variant: "card", disabledCrop: "colza", defaultValue: "ble" },
  parameters: { layout: "padded" },
}

export const CardsInvalid: Story = {
  args: { variant: "card", invalid: true },
  parameters: { layout: "padded" },
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

/**
 * A choice with a sentence under it is named by its title alone, and described by the sentence, so a screen reader
 * says "Maïs, radio button" and then the sentence, instead of reading both as its name
 */
export const TestDescribed: Story = {
  name: "Test: Named by its title, described by its sentence",
  args: { described: true },
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const mais = canvas.getByRole("radio", { name: "Maïs" })
    expect(mais).toHaveAccessibleDescription("Semé au printemps, il demande de l'eau en été")
    expect(canvas.getByRole("radio", { name: "Blé" })).toHaveAccessibleDescription(
      "Semé en octobre, récolté en juillet",
    )
  },
}

/** A plain choice has no description, and keeps its words as its name */
export const TestPlainWordsName: Story = {
  name: "Test: Plain words name the choice",
  play: ({ canvasElement }) => {
    const mais = within(canvasElement).getByRole("radio", { name: "Maïs" })
    expect(mais).not.toHaveAttribute("aria-describedby")
  },
}

/**
 * A tile is chosen by a tap anywhere on it, even far from its circle, and the arrow keys still move the choice from
 * tile to tile. The keyboard's ring is drawn on the tile, inside its edge, and not on the small circle.
 */
export const TestCardsChooseAndKeys: Story = {
  name: "Test: Tiles chosen by a tap anywhere and the arrow keys",
  args: { variant: "card" },
  parameters: { layout: "padded" },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const tile = canvas.getByRole("radio", { name: "Colza" }).closest("label")!
    const { left, bottom } = tile.getBoundingClientRect()
    await userEvent.click(document.elementFromPoint(left + 12, bottom - 12)!)
    expect(canvas.getByRole("radio", { name: "Colza" })).toBeChecked()
    expect(args.onValueChange).toHaveBeenLastCalledWith({ value: "colza" })
    expect(canvas.getByRole("radio", { name: "Colza" })).toHaveAccessibleDescription(
      "Ses fleurs jaunes nourrissent les abeilles en avril",
    )
    await userEvent.keyboard("{ArrowLeft}")
    const mais = canvas.getByRole("radio", { name: "Maïs" })
    expect(mais).toBeChecked()
    expect(mais).toHaveFocus()
    const maisTile = mais.closest("label")!
    await waitFor(() => expect(maisTile).toHaveAttribute("data-focus-visible"))
    const ring = getComputedStyle(maisTile)
    expect(ring.outlineStyle).toBe("solid")
    expect(Number.parseFloat(ring.outlineOffset) + Number.parseFloat(ring.outlineWidth)).toBeLessThanOrEqual(0)
    expect(getComputedStyle(maisTile.querySelector("[data-part=item-control]")!).outlineStyle).toBe("none")
  },
}

/** On a phone the tiles stack in one column, each the width of the screen */
export const TestCardsOnAPhone: Story = {
  name: "Test: Tiles on a phone",
  args: { variant: "card", defaultValue: "ble" },
  globals: { viewport: { value: "mobile2", isRotated: false } },
  parameters: { layout: "padded" },
  play: ({ canvasElement }) => {
    const tiles = [...canvasElement.querySelectorAll("[data-part=item]")].map((tile) => tile.getBoundingClientRect())
    expect(new Set(tiles.map((tile) => Math.round(tile.left))).size).toBe(1)
    for (const tile of tiles) expect(tile.height).toBeGreaterThanOrEqual(48)
  },
}

/** On a wide page they sit side by side */
export const TestCardsSideBySide: Story = {
  name: "Test: Tiles side by side on a wide page",
  args: { variant: "card", defaultValue: "ble" },
  parameters: { layout: "padded" },
  play: ({ canvasElement }) => {
    const group = within(canvasElement).getByRole("radiogroup")
    // Three columns of at least 15rem and two 12px gaps
    expect(group.clientWidth).toBeGreaterThanOrEqual(3 * 240 + 24)
    const tops = [...group.querySelectorAll("[data-part=item]")].map((tile) => tile.getBoundingClientRect().top)
    expect(new Set(tops).size).toBe(1)
  },
}

export const TestCardsInDarkTheme: Story = {
  name: "Test: Tiles in dark theme",
  globals: { theme: "dark" },
  args: { variant: "card", defaultValue: "mais" },
  parameters: { layout: "padded" },
}

export const TestCardsWithMoreContrast: Story = {
  name: "Test: Tiles with more contrast",
  globals: { contrast: "more" },
  args: { variant: "card", defaultValue: "mais" },
  parameters: { layout: "padded" },
}

export const TestDescribedInDarkTheme: Story = {
  name: "Test: Descriptions in dark theme",
  globals: { theme: "dark" },
  args: { described: true, defaultValue: "mais", class: "w-96" },
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

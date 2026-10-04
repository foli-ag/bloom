import { expect, fn, userEvent, waitFor, within } from "storybook/test"
import type { Meta, StoryObj } from "storybook-solidjs-vite"
import { Splitter } from "./index.js"

function MapAndList(props: Partial<Splitter.RootProps>) {
  return (
    <div class="h-72 w-[40rem] rounded-card border-2 border-border bg-raised">
      <Splitter.Root
        panels={[
          { id: "carte", minSize: 30 },
          { id: "liste", minSize: 20 },
        ]}
        defaultSize={[60, 40]}
        keyboardResizeBy={5}
        {...props}
      >
        <Splitter.Panel id="carte">
          <div class="p-4">
            <h2 class="text-lg font-semibold">Carte des parcelles</h2>
            <p class="text-muted">Les Grands Champs, La Noue, Le Pré Haut</p>
          </div>
        </Splitter.Panel>
        <Splitter.ResizeTrigger id="carte:liste" aria-label="Largeur de la carte">
          <Splitter.ResizeTrigger.Indicator />
        </Splitter.ResizeTrigger>
        <Splitter.Panel id="liste">
          <div class="p-4">
            <h2 class="text-lg font-semibold">Interventions</h2>
            <p class="text-muted">Semis de blé tendre, 12 octobre</p>
          </div>
        </Splitter.Panel>
      </Splitter.Root>
    </div>
  )
}

const meta = {
  title: "Components/Splitter",
  component: MapAndList,
  tags: ["autodocs"],
  args: { onResizeEnd: fn() },
} satisfies Meta<typeof MapAndList>

export default meta
type Story = StoryObj<typeof meta>

/**
 * A map and a list side by side with a bar between them, which a drag or the arrow keys move. Its props are in the
 * Controls panel.
 */
export const Playground: Story = {
  args: { keyboardResizeBy: 5 },
  argTypes: {
    orientation: { control: "inline-radio", options: ["horizontal", "vertical"] },
    keyboardResizeBy: { control: "number" },
  },
}

// zag measures the root on the frame after mounting and puts an uncontrolled split back to its default then
const measured = async () => {
  await new Promise(requestAnimationFrame)
  await new Promise(requestAnimationFrame)
}

/**
 * The bar between the map and the list is a separator named by its own words. The arrow keys move it by 5%, and Home
 * and End take it to the limits the panels set.
 */
export const TestWithTheKeyboard: Story = {
  name: "Test: With the keyboard",
  play: async ({ canvasElement }) => {
    await measured()
    const bar = within(canvasElement).getByRole("separator", { name: "Largeur de la carte" })
    expect(bar).toHaveAttribute("aria-valuenow", "60")
    bar.focus()
    await userEvent.keyboard("{ArrowRight}")
    await waitFor(() => expect(bar).toHaveAttribute("aria-valuenow", "65"))
    expect(getComputedStyle(bar).outlineStyle).toBe("solid")
    await userEvent.keyboard("{ArrowLeft}{ArrowLeft}{ArrowLeft}")
    await waitFor(() => expect(bar).toHaveAttribute("aria-valuenow", "50"))
    await userEvent.keyboard("{Home}")
    await waitFor(() => expect(bar).toHaveAttribute("aria-valuenow", "30"))
    await userEvent.keyboard("{End}")
    await waitFor(() => expect(bar).toHaveAttribute("aria-valuenow", "80"))
  },
}

/** The bar is 12px in the layout but takes a press 48px across, over the edge of both panels */
export const TestWideTarget: Story = {
  name: "Test: Wide target",
  play: async ({ canvasElement }) => {
    await measured()
    const bar = within(canvasElement).getByRole("separator")
    const { left, width, top, height } = bar.getBoundingClientRect()
    expect(width).toBe(12)
    const y = top + height / 2
    expect(document.elementFromPoint(left - 17, y)).toBe(bar)
    expect(document.elementFromPoint(left + width + 17, y)).toBe(bar)
  },
}

/** Stacked, the bar runs across and the grip lies flat */
export const TestStacked: Story = {
  name: "Test: Stacked",
  args: { orientation: "vertical" },
  play: async ({ canvasElement }) => {
    await measured()
    const bar = within(canvasElement).getByRole("separator")
    expect(bar).toHaveAttribute("aria-orientation", "vertical")
    expect(bar.getBoundingClientRect().height).toBe(12)
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

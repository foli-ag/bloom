import { createSignal, untrack } from "solid-js"
import { expect, userEvent, waitFor, within } from "storybook/test"
import type { Meta, StoryObj } from "storybook-solidjs-vite"
import { Button } from "../button/index.js"
import { settled } from "../foundations/settled.js"
import { Swap } from "./index.js"

function SaveButton(props: { saved?: boolean }) {
  const [saved, setSaved] = createSignal(untrack(() => props.saved) ?? false)
  return (
    <Button variant={saved() ? "soft" : "solid"} onClick={() => setSaved(!saved())}>
      <Swap.Root swap={saved()}>
        <Swap.Indicator type="off">Enregistrer l'intervention</Swap.Indicator>
        <Swap.Indicator type="on">Intervention enregistrée</Swap.Indicator>
      </Swap.Root>
    </Button>
  )
}

/** The "off" and the "on" indicator */
function indicators(canvasElement: HTMLElement) {
  return (["off", "on"] as const).map(
    (type) => canvasElement.querySelector<HTMLElement>(`[data-part=indicator][data-type=${type}]`)!,
  )
}

function frame() {
  return new Promise((resolve) => requestAnimationFrame(resolve))
}

const meta = {
  title: "Components/Swap",
  component: SaveButton,
  tags: ["autodocs"],
} satisfies Meta<typeof SaveButton>

export default meta
type Story = StoryObj<typeof meta>

/**
 * A button whose words change once the intervention is saved: press it to swap them. The new words pop in where the old
 * ones fade out, and the button keeps its width. The swap follows the button, so the Controls panel has nothing to set.
 */
export const Playground: Story = {}

/**
 * The button's words change once the intervention is saved. The new words pop in where the old ones fade out, and the
 * button keeps its width, as both sets share one cell. Only the words shown name the button.
 */
export const TestSwapOnClick: Story = {
  name: "Test: Swap on click",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await document.fonts.ready
    const button = canvas.getByRole("button", { name: "Enregistrer l'intervention" })
    const width = button.getBoundingClientRect().width
    const [off, on] = indicators(canvasElement)
    // Neither indicator animates on the first render
    expect([...off.getAnimations(), ...on.getAnimations()]).toEqual([])

    await userEvent.click(button)
    // The new words come in smaller and fainter, and grow into place
    await frame()
    expect(Number(getComputedStyle(on).opacity)).toBeLessThan(1)
    expect(Number.parseFloat(getComputedStyle(on).scale)).toBeLessThan(1)
    await settled()
    expect(button).toHaveAccessibleName("Intervention enregistrée")
    expect(button.getBoundingClientRect().width).toBeCloseTo(width, 0)
  },
}

/**
 * Pressed again before the new words are in, each set turns round from where it got to. Keyframes would start over:
 * the words on their way in would flash to full strength before leaving.
 */
export const TestChangeOfMind: Story = {
  name: "Test: Change of mind half way",
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole("button")
    const [, on] = indicators(canvasElement)
    const opacity = () => Number(getComputedStyle(on).opacity)

    await userEvent.click(button)
    await waitFor(() => expect(opacity()).toBeGreaterThan(0.2))
    const reached = opacity()
    await userEvent.click(button)
    // It goes on rising for the frame the change takes to land, then only fades
    let last = opacity()
    expect(last).toBeLessThan(Math.min(reached + 0.3, 0.9))
    while (on.getAnimations().length > 0) {
      const now = opacity()
      expect(now).toBeLessThanOrEqual(last + 0.02)
      last = now
      await frame()
    }
    expect(opacity()).toBe(0)
    expect(button).toHaveAccessibleName("Enregistrer l'intervention")
  },
}

/** Back the other way, the first words come back the same way */
export const TestBack: Story = {
  name: "Test: Back to the first words",
  args: { saved: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Intervention enregistrée" }))
    await settled()
    expect(canvas.getByRole("button")).toHaveAccessibleName("Enregistrer l'intervention")
  },
}

/** Under reduced motion the words only fade: the incoming ones are at full size from the first frame */
export const TestWithReducedMotion: Story = {
  name: "Test: With reduced motion",
  globals: { motion: "reduced" },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button"))
    const on = canvasElement.querySelector<HTMLElement>("[data-part=indicator][data-type=on]")!
    await waitFor(() => expect(on).toHaveAttribute("data-state", "open"))
    await new Promise(requestAnimationFrame)
    expect(getComputedStyle(on).scale).toBe("1")
  },
}

export const TestInDarkTheme: Story = {
  name: "Test: In dark theme",
  args: { saved: true },
  globals: { theme: "dark" },
}

export const TestWithMoreContrast: Story = {
  name: "Test: With more contrast",
  args: { saved: true },
  globals: { contrast: "more" },
}

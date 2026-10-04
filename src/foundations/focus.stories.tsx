import { For } from "solid-js"
import { expect, userEvent } from "storybook/test"
import type { Meta, StoryObj } from "storybook-solidjs-vite"
import { Button } from "../button/index.js"
import { Checkbox } from "../checkbox/index.js"
import { Input } from "../input/index.js"
import { RadioGroup } from "../radio-group/index.js"
import { Slider } from "../slider/index.js"
import { Switch } from "../switch/index.js"
import { Toggle } from "../toggle/index.js"
import { ToggleGroup } from "../toggle-group/index.js"

const meta = {
  title: "Foundations/Focus",
  parameters: { layout: "padded" },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const tones = ["primary", "neutral", "danger"] as const
const variants = ["solid", "soft", "outline", "ghost"] as const

/**
 * Where the keyboard is. The ring is drawn inside the control's own edge, over its border, so a control keeps its size
 * and its shape when it takes focus and nothing around it is covered. On a fill the ring would sink into, a line of the
 * page's color keeps it apart. Press Tab to walk through them.
 */
export const Rings: Story = {
  render: () => (
    <section class="grid max-w-3xl gap-6">
      <div class="grid gap-3">
        <For each={tones}>
          {(tone) => (
            <div class="flex flex-wrap gap-3">
              <For each={variants}>
                {(variant) => (
                  <Button tone={tone} variant={variant}>
                    {`${tone} ${variant}`}
                  </Button>
                )}
              </For>
            </div>
          )}
        </For>
      </div>
      <div class="grid max-w-sm gap-3">
        <Input aria-label="Parcelle" placeholder="Les Grands Champs" />
        <Input aria-label="Surface" aria-invalid="true" value="12,4,5" />
      </div>
      <div class="grid max-w-sm">
        <Checkbox>Irrigué</Checkbox>
        <Checkbox defaultChecked>Drainé</Checkbox>
        <Switch>Arrosage automatique</Switch>
        <Switch defaultChecked>Alertes de gel</Switch>
      </div>
      <RadioGroup.Root defaultValue="ble" class="max-w-sm">
        <RadioGroup.Label>Culture</RadioGroup.Label>
        <RadioGroup.Item value="ble">Blé</RadioGroup.Item>
        <RadioGroup.Item value="mais">Maïs</RadioGroup.Item>
      </RadioGroup.Root>
      <div class="flex flex-wrap items-center gap-3">
        <Toggle.Root>
          <Toggle.Indicator />
          Irriguées
        </Toggle.Root>
        <Toggle.Root defaultPressed>
          <Toggle.Indicator />
          Drainées
        </Toggle.Root>
        <ToggleGroup.Root aria-label="Période" defaultValue={["semaine"]}>
          <ToggleGroup.Item value="jour">Jour</ToggleGroup.Item>
          <ToggleGroup.Item value="semaine">Semaine</ToggleGroup.Item>
          <ToggleGroup.Item value="mois">Mois</ToggleGroup.Item>
        </ToggleGroup.Root>
      </div>
      <Slider.Root defaultValue={[40]} class="max-w-sm">
        <Slider.Label>Humidité du sol</Slider.Label>
        <Slider.ValueText>{(value) => `${value[0]} %`}</Slider.ValueText>
        <Slider.Control />
      </Slider.Root>
    </section>
  ),
}

/**
 * Every ring stays inside its control: its offset takes back at least its width, so nothing outside the control's edge
 * changes when it takes focus. A ring outside a control looks loose, and it covers whatever sits next to it.
 */
export const TestRingsStayInside: Story = {
  ...Rings,
  name: "Test: Rings stay inside",
  play: async ({ canvasElement }) => {
    const seen = new Set<Element>()
    for (;;) {
      await userEvent.tab()
      const focused = document.activeElement
      if (!focused || !canvasElement.contains(focused) || seen.has(focused)) break
      seen.add(focused)
      // A checkbox, a radio or a switch is focused on its hidden input, and its box draws the ring
      const hidden = focused instanceof HTMLInputElement && ["checkbox", "radio"].includes(focused.type)
      const ring = hidden
        ? focused
            .closest("[data-part=root], [data-part=item]")
            ?.querySelector("[data-part=control], [data-part=item-control]")
        : focused
      if (!ring) throw new Error(`No box for ${focused.outerHTML.slice(0, 80)}`)
      const style = getComputedStyle(ring)
      expect(style.outlineStyle, `${ring.outerHTML.slice(0, 80)} has no ring`).not.toBe("none")
      const reach = Number.parseFloat(style.outlineOffset) + Number.parseFloat(style.outlineWidth)
      expect(reach, `${ring.outerHTML.slice(0, 80)} draws its ring outside`).toBeLessThanOrEqual(0)
    }
    expect(seen.size).toBeGreaterThan(20)
  },
}

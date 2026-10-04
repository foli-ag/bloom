import { createSignal, For } from "solid-js"
import { expect, fn, userEvent, within } from "storybook/test"
import type { Meta, StoryObj } from "storybook-solidjs-vite"
import { Switch } from "./index.js"

const meta = {
  title: "Components/Switch",
  component: Switch,
  tags: ["autodocs"],
  args: { children: "Arrosage automatique", onCheckedChange: fn() },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

/**
 * The whole row is the target, 48px tall. The knob slides across and carries a tick when the setting is on. Its props
 * are in the Controls panel.
 */
export const Playground: Story = {
  argTypes: {
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    invalid: { control: "boolean" },
    required: { control: "boolean" },
    name: { control: "text" },
  },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const DisabledAndChecked: Story = {
  args: { disabled: true, defaultChecked: true },
}

/** A list of settings, each applying as it is flipped. */
export const Settings: Story = {
  render: () => <FieldSettings />,
  parameters: { layout: "padded" },
}

/**
 * The whole row is the target, 48px tall. The knob slides across and carries a tick when the setting is on.
 * Screen readers announce "on" and "off", because the native input carries `role="switch"`.
 */
export const TestTogglesFromLabelAndSpace: Story = {
  name: "Test: Toggles from its label and Space",
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const control = canvas.getByRole("switch", { name: "Arrosage automatique" })
    expect(control).not.toBeChecked()
    await userEvent.click(canvas.getByText("Arrosage automatique"))
    expect(control).toBeChecked()
    expect(args.onCheckedChange).toHaveBeenLastCalledWith(expect.objectContaining({ checked: true }))
    await userEvent.keyboard(" ")
    expect(control).not.toBeChecked()
  },
}

/** On: the knob slides 24px to the end and turns dark on the green track as the tick draws in, together. */
export const TestKnobSlidesWhenChecked: Story = {
  name: "Test: Knob slides when checked",
  args: { defaultChecked: true },
  play: ({ canvasElement }) => {
    const thumb = canvasElement.querySelector("[data-part=thumb]")
    expect(thumb).toHaveAttribute("data-state", "checked")
    expect(getComputedStyle(thumb!).translate).not.toBe("none")
  },
}

export const TestKeyboardFocus: Story = {
  name: "Test: Keyboard focus",
  play: async ({ canvasElement }) => {
    await userEvent.tab()
    expect(within(canvasElement).getByRole("switch")).toHaveFocus()
    expect(canvasElement.querySelector("[data-part=control]")).toHaveAttribute("data-focus-visible")
  },
}

export const TestInDarkTheme: Story = {
  name: "Test: In dark theme",
  globals: { theme: "dark" },
  args: { defaultChecked: true },
}

export const TestWithMoreContrast: Story = {
  name: "Test: With more contrast",
  globals: { contrast: "more" },
  args: { defaultChecked: true },
}

const settings = ["Arrosage automatique", "Alerte gel", "Rapport de la semaine"] as const

function FieldSettings() {
  const [on, setOn] = createSignal(new Set<string>(["Alerte gel"]))
  return (
    <div role="group" aria-labelledby="notifications" class="grid w-80">
      <h3 id="notifications" class="mb-1 text-lg font-bold tracking-heading">
        Notifications
      </h3>
      <For each={settings}>
        {(setting) => (
          <Switch
            checked={on().has(setting)}
            onCheckedChange={(details) =>
              setOn((current) => {
                const next = new Set(current)
                if (details.checked) next.add(setting)
                else next.delete(setting)
                return next
              })
            }
          >
            {setting}
          </Switch>
        )}
      </For>
    </div>
  )
}

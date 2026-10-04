import type { JSX } from "@solidjs/web"
import { expect, userEvent, within } from "storybook/test"
import type { Meta, StoryObj } from "storybook-solidjs-vite"
import { Input, type InputProps } from "./index.js"

const meta = {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "inline-radio", options: ["md", "lg"] },
    invalid: { control: "boolean" },
    disabled: { control: "boolean" },
    readonly: { control: "boolean" },
    required: { control: "boolean" },
    placeholder: { control: "text" },
  },
  decorators: [(Story) => <div class="w-[min(24rem,90vw)]">{Story()}</div>],
} satisfies Meta<InputProps>

export default meta
type Story = StoryObj<typeof meta>

/**
 * A field is a visible label, the input, and help under it, wired together with `aria-describedby`. Its props are in
 * the Controls panel.
 */
export const Playground: Story = {
  render: (args) => <ParcelName {...args} />,
}

/** `inputmode="decimal"` opens the numeric pad with a decimal key on a phone. */
export const Numeric: Story = {
  render: (args) => (
    <Field label="Rendement en t/ha" id="rendement" hint="Par exemple 7,4">
      <Input
        {...args}
        id="rendement"
        name="rendement"
        inputmode="decimal"
        autocomplete="off"
        aria-describedby="rendement-hint"
      />
    </Field>
  ),
}

/** 56px, for a field that is the point of its screen. */
export const Large: Story = {
  args: { size: "lg" },
  render: (args) => <ParcelName {...args} />,
}

export const Disabled: Story = {
  render: (args) => (
    <Field label="Exploitation" id="exploitation" hint="Fixée par votre coopérative.">
      <Input {...args} id="exploitation" disabled value="GAEC des Trois Chênes" aria-describedby="exploitation-hint" />
    </Field>
  ),
}

/** A field is a visible label, the input, and help under it. The input is wired to the help with `aria-describedby`. */
export const TestTypingInTheField: Story = {
  name: "Test: Typing in the field",
  render: (args) => <ParcelName {...args} />,
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByLabelText("Nom de la parcelle")
    await userEvent.type(input, "Les Œillets")
    expect(input).toHaveValue("Les Œillets")
    expect(input).toHaveAccessibleDescription("Le nom que vous lui donnez, par exemple « Les Œillets ».")
  },
}

/**
 * An invalid input says so in three ways that do not depend on color: `aria-invalid`, a second line on its edge, and
 * text that names the problem and is read out with the field.
 */
export const TestInvalidFieldAndItsProblem: Story = {
  name: "Test: Invalid field and its problem",
  render: (args) => (
    <Field label="Surface en hectares" id="surface" hint="Saisissez un nombre, avec une virgule : 12,5" problem>
      <Input {...args} id="surface" name="surface" invalid value="douze" aria-describedby="surface-hint" />
    </Field>
  ),
  play: ({ canvasElement }) => {
    const input = within(canvasElement).getByLabelText("Surface en hectares")
    expect(input).toBeInvalid()
    expect(input).toHaveAccessibleDescription("Saisissez un nombre, avec une virgule : 12,5")
  },
}

export const TestInDarkTheme: Story = {
  name: "Test: In dark theme",
  render: (args) => <ParcelName {...args} />,
  globals: { theme: "dark" },
}

export const TestWithMoreContrast: Story = {
  name: "Test: With more contrast",
  render: (args) => <ParcelName {...args} />,
  globals: { contrast: "more" },
}

function ParcelName(props: InputProps) {
  return (
    <Field label="Nom de la parcelle" id="parcelle" hint="Le nom que vous lui donnez, par exemple « Les Œillets ».">
      <Input {...props} id="parcelle" name="parcelle" aria-describedby="parcelle-hint" />
    </Field>
  )
}

// A minimal field, until bloom has its own: what a label, an input and its help need so that all three are read together
function Field(props: { label: string; id: string; hint: string; problem?: boolean; children: JSX.Element }) {
  return (
    <div class="grid gap-1.5">
      <label for={props.id} class="font-semibold">
        {props.label}
      </label>
      {props.children}
      <p id={`${props.id}-hint`} class={props.problem ? "font-semibold text-danger-text" : "text-sm text-muted"}>
        {props.problem ? <span aria-hidden="true">✕ </span> : null}
        {props.hint}
      </p>
    </div>
  )
}

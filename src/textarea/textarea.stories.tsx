import type { JSX } from "@solidjs/web"
import { expect, userEvent, within } from "storybook/test"
import type { Meta, StoryObj } from "storybook-solidjs-vite"
import { Textarea, type TextareaProps } from "./index.js"

const meta = {
  title: "Components/Textarea",
  component: Textarea,
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
} satisfies Meta<TextareaProps>

export default meta
type Story = StoryObj<typeof meta>

const visit =
  "Levée régulière sur tout l'îlot, environ 25 plantes au mètre carré. Quelques pucerons en bordure de haie, sous le seuil. Sol ressuyé, passage possible dès jeudi. Prévoir un tour de plaine la semaine prochaine pour les limaces après les pluies annoncées, surtout dans la partie basse près du fossé, qui reste humide plus longtemps que le reste de la parcelle."

/**
 * A note over several lines, with a visible label and help under it wired with `aria-describedby`. It grows as the text
 * does. Its props are in the Controls panel.
 */
export const Playground: Story = {
  render: (args) => <Note {...args} />,
}

/** Past ten lines it stops growing and scrolls */
export const LongText: Story = {
  render: (args) => <Note {...args} value={visit} />,
}

/** 20px text, for a note that is the point of its screen */
export const Large: Story = {
  args: { size: "lg" },
  render: (args) => <Note {...args} />,
}

export const Invalid: Story = {
  render: (args) => (
    <Field label="Motif du report" id="motif" hint="Dites en une phrase pourquoi l'intervention est reportée." problem>
      <Textarea {...args} id="motif" name="motif" invalid aria-describedby="motif-hint" />
    </Field>
  ),
}

export const Disabled: Story = {
  render: (args) => <Note {...args} disabled value="Visite validée par le technicien." />,
}

/**
 * Two lines tall when empty, it grows line by line as the farmer writes, at once and without easing, and stops at ten
 * lines, from where the text scrolls inside it.
 */
export const TestGrowingWithTheText: Story = {
  name: "Test: Growing with the text",
  render: (args) => <Note {...args} />,
  play: async ({ canvasElement }) => {
    const field = within(canvasElement).getByLabelText<HTMLTextAreaElement>("Observations")
    const lineHeight = Number.parseFloat(getComputedStyle(field).lineHeight)
    const empty = field.getBoundingClientRect().height
    expect(empty).toBeGreaterThanOrEqual(2 * lineHeight)

    await userEvent.type(field, "Levée régulière.{Enter}Pucerons en bordure.{Enter}Sol ressuyé.")
    const three = field.getBoundingClientRect().height
    expect(three).toBeCloseTo(empty + lineHeight, 0)
    // Its edge eases to the focus look, but nothing eases its height
    const moving = field.getAnimations().map((animation) => (animation as CSSTransition).transitionProperty)
    expect(moving).not.toContain("height")
    expect(moving).not.toContain("min-height")

    await userEvent.type(field, "{Enter}a".repeat(12))
    const full = field.getBoundingClientRect().height
    expect(full).toBeLessThanOrEqual(empty + 8 * lineHeight + 1)
    expect(field.scrollHeight).toBeGreaterThan(field.clientHeight)
  },
}

export const TestInDarkTheme: Story = {
  name: "Test: In dark theme",
  render: (args) => <Note {...args} value={visit} />,
  globals: { theme: "dark" },
}

export const TestWithMoreContrast: Story = {
  name: "Test: With more contrast",
  render: (args) => <Note {...args} value={visit} />,
  globals: { contrast: "more" },
}

function Note(props: TextareaProps) {
  return (
    <Field label="Observations" id="observations" hint="Ce que vous avez vu lors de la visite.">
      <Textarea {...props} id="observations" name="observations" aria-describedby="observations-hint" />
    </Field>
  )
}

// A minimal field, until bloom has its own, as in the Input stories
function Field(props: { label: string; id: string; hint: string; problem?: boolean; children: JSX.Element }) {
  return (
    <div class="grid gap-2">
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

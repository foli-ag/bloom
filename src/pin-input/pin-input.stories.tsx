import { For } from "solid-js"
import { expect, fn, userEvent, waitFor, within } from "storybook/test"
import type { Meta, StoryObj } from "storybook-solidjs-vite"
import { PinInput } from "./index.js"

const translations: PinInput.RootProps["translations"] = {
  inputLabel: (index, length) => `Chiffre ${index + 1} sur ${length}`,
}

function SmsCode(props: Partial<PinInput.RootProps>) {
  return (
    <form>
      <PinInput.Root name="code" otp translations={translations} {...props}>
        <PinInput.Label>Code reçu par SMS</PinInput.Label>
        <PinInput.Control>
          <For each={[0, 1, 2, 3, 4, 5]}>{(index) => <PinInput.Input index={index} />}</For>
        </PinInput.Control>
        <PinInput.HiddenInput />
      </PinInput.Root>
    </form>
  )
}

const meta = {
  title: "Components/PinInput",
  component: SmsCode,
  tags: ["autodocs"],
  args: { onValueComplete: fn() },
} satisfies Meta<typeof SmsCode>

export default meta
type Story = StoryObj<typeof meta>

function paste(text: string) {
  const clipboardData = new DataTransfer()
  clipboardData.setData("text/plain", text)
  document.activeElement!.dispatchEvent(new ClipboardEvent("paste", { clipboardData, bubbles: true, cancelable: true }))
}

/**
 * Each box is named in French, not by zag's "pin code 1 of 6". Focus moves on as each digit is typed and back on
 * Backspace, and the whole code goes into the form once it is complete.
 */
export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const first = canvas.getByRole("textbox", { name: "Chiffre 1 sur 6" })
    expect(first).toHaveAttribute("autocomplete", "one-time-code")
    expect(first).toHaveAttribute("inputmode", "numeric")

    await userEvent.click(first)
    await userEvent.keyboard("482")
    await waitFor(() => expect(canvas.getByRole("textbox", { name: "Chiffre 4 sur 6" })).toHaveFocus())
    await userEvent.keyboard("{Backspace}")
    await waitFor(() => expect(canvas.getByRole("textbox", { name: "Chiffre 3 sur 6" })).toHaveFocus())
    expect(canvas.getByRole("textbox", { name: "Chiffre 3 sur 6" })).toHaveValue("")

    await userEvent.keyboard("2915")
    await waitFor(() =>
      expect(args.onValueComplete).toHaveBeenCalledWith(expect.objectContaining({ valueAsString: "482915" })),
    )
    expect(new FormData(canvasElement.querySelector("form")!).get("code")).toBe("482915")
  },
}

/** Pasting the code from a message fills every box at once */
export const Pasted: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("textbox", { name: "Chiffre 1 sur 6" }))
    paste("731046")
    await waitFor(() => expect(canvas.getByRole("textbox", { name: "Chiffre 6 sur 6" })).toHaveValue("6"))
    expect(args.onValueComplete).toHaveBeenCalledWith(expect.objectContaining({ valueAsString: "731046" }))
  },
}

export const Filled: Story = {
  render: () => <SmsCode defaultValue={["4", "8", "2", "9", "1", "5"]} />,
}

export const Invalid: Story = {
  render: () => <SmsCode defaultValue={["4", "8", "2", "9", "1", "5"]} invalid />,
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const InDarkTheme: Story = {
  render: () => <SmsCode defaultValue={["4", "8", "2", "", "", ""]} />,
  globals: { theme: "dark" },
}

export const WithMoreContrast: Story = {
  render: () => <SmsCode defaultValue={["4", "8", "2", "", "", ""]} />,
  globals: { contrast: "more" },
}

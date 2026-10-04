import { For } from "solid-js"
import { expect, fn, userEvent, waitFor, within } from "storybook/test"
import type { Meta, StoryObj } from "storybook-solidjs-vite"
import { Button } from "../button/index.js"
import { Pagination } from "./index.js"

const translations: Pagination.Translations = {
  rootLabel: "Pages des interventions",
  itemLabel: ({ page, totalPages }) => `Page ${page} sur ${totalPages}`,
}

function Interventions(props: Partial<Pagination.RootProps>) {
  return (
    <Pagination.Root count={120} pageSize={20} translations={translations} {...props}>
      <Pagination.Trigger.Prev as={Button} tone="neutral" variant="outline">
        Précédente
      </Pagination.Trigger.Prev>
      <Pagination.Context>
        {(api) => (
          <For each={api().pages}>
            {(entry, index) =>
              entry.type === "page" ? (
                <Pagination.Item {...entry}>{entry.value}</Pagination.Item>
              ) : (
                <Pagination.Ellipsis index={index()} />
              )
            }
          </For>
        )}
      </Pagination.Context>
      <Pagination.Trigger.Next as={Button} tone="neutral" variant="outline">
        Suivante
      </Pagination.Trigger.Next>
    </Pagination.Root>
  )
}

const meta = {
  title: "Components/Pagination",
  component: Interventions,
  tags: ["autodocs"],
  args: { onPageChange: fn() },
} satisfies Meta<typeof Interventions>

export default meta
type Story = StoryObj<typeof meta>

/**
 * A navigation named in French, its pages named by the app and its triggers by their own words. A tap on a page shows
 * it, the triggers step one page, and the first and last pages have no way further.
 */
export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    canvas.getByRole("navigation", { name: "Pages des interventions" })
    const previous = canvas.getByRole("button", { name: "Précédente" })
    expect(previous).toBeDisabled()
    expect(canvas.getByRole("button", { name: "Page 1 sur 6" })).toHaveAttribute("aria-current", "page")

    await userEvent.click(canvas.getByRole("button", { name: "Page 3 sur 6" }))
    await waitFor(() =>
      expect(canvas.getByRole("button", { name: "Page 3 sur 6" })).toHaveAttribute("aria-current", "page"),
    )
    expect(args.onPageChange).toHaveBeenLastCalledWith({ page: 3, pageSize: 20 })

    await userEvent.click(canvas.getByRole("button", { name: "Suivante" }))
    await waitFor(() =>
      expect(canvas.getByRole("button", { name: "Page 4 sur 6" })).toHaveAttribute("aria-current", "page"),
    )
    await userEvent.click(previous)
    await waitFor(() =>
      expect(canvas.getByRole("button", { name: "Page 3 sur 6" })).toHaveAttribute("aria-current", "page"),
    )
  },
}

/** Many pages: those far from the current one are left out behind dots, which say nothing to a screen reader */
export const ManyPages: Story = {
  args: { count: 400, defaultPage: 10 },
  play: ({ canvasElement }) => {
    const dots = canvasElement.querySelectorAll("[data-part=ellipsis]")
    expect(dots).toHaveLength(2)
    expect(dots[0]).toHaveAccessibleName("")
  },
}

/** On a phone the row wraps instead of running off the screen */
export const OnAPhone: Story = {
  args: { count: 400, defaultPage: 10 },
  globals: { viewport: { value: "mobile2", isRotated: false } },
  play: ({ canvasElement }) => {
    const root = canvasElement.querySelector("nav")!
    expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth)
  },
}

export const InDarkTheme: Story = {
  args: { defaultPage: 2 },
  globals: { theme: "dark" },
}

export const WithMoreContrast: Story = {
  args: { defaultPage: 2 },
  globals: { contrast: "more" },
}

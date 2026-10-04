import { For, untrack } from "solid-js"
import { expect, fn, userEvent, waitFor, within } from "storybook/test"
import type { Meta, StoryObj } from "storybook-solidjs-vite"
import { Button } from "../button/index.js"
import { settled } from "../foundations/settled.js"
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
          // Keyed by page number, as zag rebuilds `pages` on every change: a page keeps its button, and the focus on it.
          // The key holds the page, so its entry never changes under it and is read once.
          <For each={api().pages} keyed={(entry) => (entry.type === "page" ? entry.value : entry)}>
            {(entry, index) => {
              const page = untrack(entry)
              return page.type === "page" ? (
                <Pagination.Item {...page}>{page.value}</Pagination.Item>
              ) : (
                <Pagination.Ellipsis index={index()} />
              )
            }}
          </For>
        )}
      </Pagination.Context>
      <Pagination.ProgressText>{({ page, totalPages }) => `${page} / ${totalPages}`}</Pagination.ProgressText>
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
 * A navigation named in French, its pages named by the app and its triggers by their own words. Its props are in the
 * Controls panel.
 */
export const Playground: Story = {
  args: { count: 120, pageSize: 20, siblingCount: 1, boundaryCount: 1 },
  argTypes: {
    count: { control: { type: "number", min: 0 } },
    pageSize: { control: { type: "number", min: 1 } },
    siblingCount: { control: { type: "number", min: 0 } },
    boundaryCount: { control: { type: "number", min: 0 } },
    compact: { control: "inline-radio", options: [false, true, "phone"] },
  },
}

/**
 * A navigation named in French, its pages named by the app and its triggers by their own words. A tap on a page shows
 * it, the triggers step one page, and the first and last pages have no way further.
 */
export const TestMovingBetweenPages: Story = {
  name: "Test: Moving between pages",
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
export const TestManyPages: Story = {
  name: "Test: Many pages",
  args: { count: 400, defaultPage: 10 },
  play: ({ canvasElement }) => {
    const dots = canvasElement.querySelectorAll("[data-part=ellipsis]")
    expect(dots).toHaveLength(2)
    expect(dots[0]).toHaveAccessibleName("")
  },
}

/**
 * A page chosen from the keyboard keeps the focus as it becomes current, even as the pages around it shift, so the
 * farmer goes on from where they are and not from the top of the screen
 */
export const TestWithTheKeyboard: Story = {
  name: "Test: With the keyboard",
  args: { count: 400, defaultPage: 10 },
  play: async ({ canvasElement }) => {
    const page = within(canvasElement).getByRole("button", { name: "Page 11 sur 20" })
    page.focus()
    await userEvent.keyboard("{Enter}")
    await waitFor(() => expect(page).toHaveAttribute("aria-current", "page"))
    expect(page).toHaveFocus()
  },
}

/** On a phone the row wraps instead of running off the screen */
export const TestOnAPhone: Story = {
  name: "Test: On a phone",
  args: { count: 400, defaultPage: 10 },
  globals: { viewport: { value: "mobile2", isRotated: false } },
  play: ({ canvasElement }) => {
    const root = canvasElement.querySelector("nav")!
    expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth)
  },
}

export const TestInDarkTheme: Story = {
  name: "Test: In dark theme",
  args: { defaultPage: 2 },
  globals: { theme: "dark" },
}

export const TestWithMoreContrast: Story = {
  name: "Test: With more contrast",
  args: { defaultPage: 2 },
  globals: { contrast: "more" },
}

/**
 * Compact, for a phone: the triggers at the ends of the row and the position between them in the app's words. The
 * pages and their dots are hidden.
 */
export const Compact: Story = {
  args: { compact: true, count: 240, defaultPage: 3 },
  parameters: { layout: "padded" },
}

/** Compact on a phone only: the same pagination shows its row of pages from 640px */
export const CompactOnAPhone: Story = {
  args: { compact: "phone", count: 240, defaultPage: 3 },
  parameters: { layout: "padded" },
  globals: { viewport: { value: "mobile2", isRotated: false } },
}

/**
 * From the keyboard, Next goes on page after page and the position follows, which a screen reader hears. On the last
 * page Next can no longer be pressed, and the focus moves to Previous instead of dropping to the top of the page.
 */
export const TestCompactWithTheKeyboard: Story = {
  name: "Test: Compact with the keyboard",
  args: { compact: true, count: 60, defaultPage: 1 },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    expect(canvas.queryByRole("button", { name: /^Page/ })).toBeNull()
    const position = canvasElement.querySelector("[data-part=progress-text]")!
    expect(position).toHaveAttribute("aria-live", "polite")
    expect(position).toHaveTextContent("1 / 3")
    const next = canvas.getByRole("button", { name: "Suivante" })
    next.focus()
    await userEvent.keyboard("{Enter}")
    await waitFor(() => expect(args.onPageChange).toHaveBeenLastCalledWith({ page: 2, pageSize: 20 }))
    await userEvent.keyboard("{Enter}")
    await waitFor(() => expect(next).toBeDisabled())
    await waitFor(() => expect(canvas.getByRole("button", { name: "Précédente" })).toHaveFocus())
    // Only the position shown is read, and the ones that rolled out go once they have
    await waitFor(() => expect(position).toHaveTextContent(/^3 \/ 3$/))
  },
}

/** The same, in a pagination with its pages: the focus moves to the last page, now the current one */
export const TestLastPageKeepsTheFocus: Story = {
  name: "Test: Last page keeps the focus",
  args: { count: 60, defaultPage: 2 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    canvas.getByRole("button", { name: "Suivante" }).focus()
    await userEvent.keyboard("{Enter}")
    await waitFor(() => expect(canvas.getByRole("button", { name: "Page 3 sur 3" })).toHaveFocus())
  },
}

/**
 * As the page changes, the old position rolls out the way the farmer went and the new one rolls in: up for the next
 * page, down for the one before. Nothing moved as the page loaded.
 */
export const TestCompactPositionRolls: Story = {
  name: "Test: Compact position rolls",
  args: { compact: true, count: 240, defaultPage: 3 },
  play: async ({ canvasElement }) => {
    expect(document.getAnimations()).toEqual([])
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Suivante" }))
    const entering = await waitFor(() => {
      const entry = canvasElement.querySelector<HTMLElement>("[data-part=progress-text] > [data-state=open]")!
      expect(entry).toHaveTextContent("4 / 12")
      return entry
    })
    const leaving = canvasElement.querySelector<HTMLElement>("[data-part=progress-text] > [data-state=closed]")!
    expect(leaving).toHaveTextContent("3 / 12")
    expect(leaving).toHaveAttribute("aria-hidden", "true")
    await waitFor(() =>
      expect(Number.parseFloat(getComputedStyle(leaving).translate.split(" ")[1] ?? "0")).toBeLessThan(0),
    )
    expect(entering.getAnimations().length).toBeGreaterThan(0)
    await settled()
    expect(canvasElement.querySelectorAll("[data-part=progress-text] > span")).toHaveLength(1)
  },
}

/** Compact on a phone: the row holds the triggers and the position only, at the full width, without wrapping */
export const TestCompactOnAPhone: Story = {
  ...CompactOnAPhone,
  name: "Test: Compact on a phone",
  play: ({ canvasElement }) => {
    const root = canvasElement.querySelector("nav")!
    const [previous, next] = within(canvasElement).getAllByRole("button")
    expect(previous!.getBoundingClientRect().top).toBe(next!.getBoundingClientRect().top)
    expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth)
    expect(within(canvasElement).getByText("3 / 12")).toBeVisible()
    expect(canvasElement.querySelector("[data-part=item]")).not.toBeVisible()
  },
}

/** From 640px a pagination compact on a phone shows its row of pages, and not the position */
export const TestCompactOnAPhoneFromTablet: Story = {
  name: "Test: Compact on a phone, from 640px",
  args: { compact: "phone", count: 240, defaultPage: 3 },
  play: ({ canvasElement }) => {
    expect(within(canvasElement).getByRole("button", { name: "Page 3 sur 12" })).toBeVisible()
    expect(canvasElement.querySelector("[data-part=progress-text]")).not.toBeVisible()
  },
}

export const TestCompactInDarkTheme: Story = {
  ...Compact,
  name: "Test: Compact in dark theme",
  globals: { theme: "dark" },
}

export const TestCompactWithMoreContrast: Story = {
  ...Compact,
  name: "Test: Compact with more contrast",
  globals: { contrast: "more" },
}

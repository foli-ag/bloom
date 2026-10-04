import { For, omit, Show } from "solid-js"
import { expect, fn, userEvent, waitFor, within } from "storybook/test"
import type { Meta, StoryObj } from "storybook-solidjs-vite"
import { settled } from "../foundations/settled.js"
import { createTreeCollection, TreeView } from "./index.js"

interface Place {
  value: string
  label: string
  children?: Place[]
}

const farm = createTreeCollection<Place>({
  rootNode: {
    value: "ferme",
    label: "Ferme du Moulin",
    children: [
      {
        value: "ilot-1",
        label: "Îlot 1, Le Moulin",
        children: [
          { value: "grands-champs", label: "Les Grands Champs" },
          { value: "noue", label: "La Noue" },
        ],
      },
      {
        value: "ilot-2",
        label: "Îlot 2, Le Plateau",
        children: [
          { value: "pre-haut", label: "Le Pré Haut" },
          { value: "longues-raies", label: "Les Longues Raies" },
          { value: "bois", label: "Le Bout du Bois" },
        ],
      },
      { value: "verger", label: "Le Verger" },
    ],
  },
})

function Node(props: { node: Place; indexPath: number[]; checkable?: boolean | undefined }) {
  return (
    <TreeView.Node.Provider node={props.node} indexPath={props.indexPath}>
      <Show
        when={props.node.children}
        fallback={
          <TreeView.Item>
            <Show when={props.checkable}>
              <TreeView.Node.Checkbox aria-label={props.node.label}>
                <TreeView.Node.Checkbox.Indicator />
              </TreeView.Node.Checkbox>
            </Show>
            <TreeView.Item.Text>{props.node.label}</TreeView.Item.Text>
            <TreeView.Item.Indicator />
          </TreeView.Item>
        }
      >
        <TreeView.Branch>
          <TreeView.Branch.Control>
            <TreeView.Branch.Indicator />
            <TreeView.Branch.Text>{props.node.label}</TreeView.Branch.Text>
          </TreeView.Branch.Control>
          <TreeView.Branch.Content>
            <TreeView.Branch.IndentGuide />
            <For each={props.node.children}>
              {(child, index) => (
                <Node node={child} indexPath={[...props.indexPath, index()]} checkable={props.checkable} />
              )}
            </For>
          </TreeView.Branch.Content>
        </TreeView.Branch>
      </Show>
    </TreeView.Node.Provider>
  )
}

type FarmProps = Omit<TreeView.RootProps<Place>, "collection"> & { checkable?: boolean | undefined }

// Storybook turns `args` into a store, whose arrays zag cannot compare, so the values are copied
const copy = (values: string[] | undefined) => (values ? [...values] : undefined)

function Farm(props: FarmProps) {
  return (
    <TreeView.Root
      collection={farm}
      class="w-80"
      {...omit(props, "checkable", "defaultExpandedValue", "defaultSelectedValue", "defaultCheckedValue")}
      defaultExpandedValue={copy(props.defaultExpandedValue)}
      defaultSelectedValue={copy(props.defaultSelectedValue)}
      defaultCheckedValue={copy(props.defaultCheckedValue)}
    >
      <TreeView.Label>Parcelles</TreeView.Label>
      <TreeView.Tree>
        <For each={farm.rootNode.children}>
          {(node, index) => <Node node={node} indexPath={[index()]} checkable={props.checkable} />}
        </For>
      </TreeView.Tree>
    </TreeView.Root>
  )
}

const meta = {
  title: "Components/TreeView",
  component: Farm,
  tags: ["autodocs"],
  args: { onSelectionChange: fn(), onExpandedChange: fn() },
} satisfies Meta<typeof Farm>

export default meta
type Story = StoryObj<typeof meta>

const branch = (name: string) => within(document.body).getByRole("treeitem", { name: new RegExp(`^${name}`) })

/**
 * The tree is named by its label, not by zag's English "Tree View". A tap on a block opens it and a tap on a field
 * selects it, with a tick at the end of its row.
 */
export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const tree = canvas.getByRole("tree", { name: "Parcelles" })
    expect(tree).not.toHaveAttribute("aria-label", "Tree View")
    expect(branch("Îlot 1")).toHaveAttribute("aria-expanded", "false")
    expect(canvas.queryByRole("treeitem", { name: "La Noue" })).toBeNull()

    await userEvent.click(canvas.getByRole("button", { name: "Îlot 1, Le Moulin" }))
    expect(branch("Îlot 1")).toHaveAttribute("aria-expanded", "true")
    const noue = await canvas.findByRole("treeitem", { name: "La Noue" })
    expect(noue).toHaveAttribute("aria-level", "2")
    await settled()

    await userEvent.click(noue)
    expect(noue).toHaveAttribute("aria-selected", "true")
    expect(args.onSelectionChange).toHaveBeenLastCalledWith(expect.objectContaining({ selectedValue: ["noue"] }))
    expect(noue.querySelector("[data-part=item-indicator]")).toBeVisible()
  },
}

/**
 * From the keyboard: the right arrow opens a block and steps into it, the down arrow moves, Enter selects, and the left
 * arrow goes back out to the block and closes it.
 */
export const WithTheKeyboard: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.tab()
    const control = canvas.getByRole("button", { name: "Îlot 1, Le Moulin" })
    expect(control).toHaveFocus()

    await userEvent.keyboard("{ArrowRight}")
    expect(branch("Îlot 1")).toHaveAttribute("aria-expanded", "true")
    await userEvent.keyboard("{ArrowRight}")
    await waitFor(() => expect(canvas.getByRole("treeitem", { name: "Les Grands Champs" })).toHaveFocus())
    await userEvent.keyboard("{ArrowDown}{Enter}")
    expect(canvas.getByRole("treeitem", { name: "La Noue" })).toHaveAttribute("aria-selected", "true")

    await userEvent.keyboard("{ArrowLeft}")
    await waitFor(() => expect(control).toHaveFocus())
    await userEvent.keyboard("{ArrowLeft}")
    expect(branch("Îlot 1")).toHaveAttribute("aria-expanded", "false")
  },
}

/** Each level steps in by 24px, and every row is 48px tall */
export const Levels: Story = {
  args: { defaultExpandedValue: ["ilot-2"] },
  play: async ({ canvasElement }) => {
    await settled()
    const canvas = within(canvasElement)
    const block = canvas.getByRole("button", { name: "Îlot 2, Le Plateau" })
    const field = canvas.getByRole("treeitem", { name: "Le Pré Haut" })
    expect(field.getBoundingClientRect().height).toBeGreaterThanOrEqual(48)
    const indent = (element: HTMLElement) => Number.parseFloat(getComputedStyle(element).paddingInlineStart)
    expect(indent(field) - indent(block)).toBe(24)
  },
}

/** With boxes, checking a block checks its fields, and a block with some of its fields checked shows a dash */
export const WithBoxes: Story = {
  args: { checkable: true, defaultExpandedValue: ["ilot-2"], defaultCheckedValue: [], onCheckedChange: fn() },
  play: async ({ canvasElement }) => {
    await settled()
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("checkbox", { name: "Le Pré Haut" }))
    expect(canvas.getByRole("checkbox", { name: "Le Pré Haut" })).toHaveAttribute("aria-checked", "true")
    // The tap checks the box without selecting the row
    expect(canvas.getByRole("treeitem", { name: /^Le Pré Haut/ })).toHaveAttribute("aria-selected", "false")
  },
}

export const InDarkTheme: Story = {
  args: { defaultExpandedValue: ["ilot-1"], defaultSelectedValue: ["noue"] },
  globals: { theme: "dark" },
  play: settled,
}

export const WithMoreContrast: Story = {
  args: { defaultExpandedValue: ["ilot-1"], defaultSelectedValue: ["noue"] },
  globals: { contrast: "more" },
  play: settled,
}

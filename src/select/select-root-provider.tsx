import { Select as Seed } from "@foliag/seeds/select"
import { omit, type Element } from "solid-js"
import { fieldRoot } from "../internal/field.js"
import { ListLoadingContext } from "../internal/list-loading.jsx"

export type SelectRootProviderProps = Omit<Seed.RootProviderProps, "as" | "class" | "lazyMount" | "unmountOnExit"> & {
  /** The options are on their way: see `Root` */
  loading?: boolean | undefined
  class?: string | undefined
}

/** A root for a select made with bloom's `useSelect`, whose state the app then reads and sets from outside it */
export function SelectRootProvider(props: SelectRootProviderProps): Element {
  return (
    <ListLoadingContext value={() => props.loading === true}>
      <Seed.RootProvider
        {...omit(props, "class", "loading")}
        lazyMount
        unmountOnExit
        class={fieldRoot({ class: props.class })}
      />
    </ListLoadingContext>
  )
}

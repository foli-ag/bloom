import { createContext, useContext } from "solid-js"

/** How wide the card is from 640px */
export type DialogSize = "sm" | "md" | "lg"
/** What the dialog is on a phone, below 640px: a sheet from the bottom edge, or the whole screen */
export type DialogPhone = "sheet" | "full-screen"

export interface DialogLook {
  size: () => DialogSize
  phone: () => DialogPhone
}

export const DialogLookContext = /* @__PURE__ */ createContext<DialogLook | null>(null)

export function useDialogLook(): DialogLook {
  const look = useContext(DialogLookContext)
  return { size: () => look?.size() ?? "md", phone: () => look?.phone() ?? "sheet" }
}

/** The look the root's props ask for, read by its parts */
export function lookOf(props: { size?: DialogSize | undefined; phone?: DialogPhone | undefined }): DialogLook {
  return { size: () => props.size ?? "md", phone: () => props.phone ?? "sheet" }
}

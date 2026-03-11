"use client"
import { useOptimistic } from "@sanity/visual-editing/react"

// Generic reducer: updates matching document in an array
function documentListReducer<T extends { _id: string }>(
  currentList: T[],
  action: { document: Record<string, unknown>; id: string },
): T[] {
  return currentList.map((item) =>
    item._id === action.id || item._id === `drafts.${action.id}`
      ? { ...item, ...(action.document as Partial<T>) }
      : item,
  )
}

// Generic reducer: updates a single document
function documentReducer<T extends { _id: string }>(
  current: T | null,
  action: { document: Record<string, unknown>; id: string },
): T | null {
  if (!current) return current
  if (current._id === action.id || current._id === `drafts.${action.id}`) {
    return { ...current, ...(action.document as Partial<T>) }
  }
  return current
}

export function useOptimisticList<T extends { _id: string }>(items: T[]): T[] {
  return useOptimistic<T[], { document: Record<string, unknown>; id: string }>(
    items,
    documentListReducer,
  )
}

export function useOptimisticDocument<T extends { _id: string }>(doc: T | null): T | null {
  return useOptimistic<T | null, { document: Record<string, unknown>; id: string }>(
    doc,
    documentReducer,
  )
}

import { create } from 'zustand'

export type ChamberContentKind =
  | 'projectCard'
  | 'skillRadar'
  | 'timeline'
  | 'holographicPanel'
  | 'mediaReveal'

export interface ChamberContentItem {
  id: string
  kind: ChamberContentKind
  // Normalized viewport coordinates (0..1) for future dynamic placement.
  anchor: { x: number; y: number }
  payload?: Record<string, unknown>
}

interface ChamberContentStore {
  items: ChamberContentItem[]
  addItem: (item: ChamberContentItem) => void
  removeItem: (id: string) => void
  clearItems: () => void
}

export const useChamberContentStore = create<ChamberContentStore>((set) => ({
  items: [],
  addItem: (item) =>
    set((state) => ({
      items: [...state.items.filter((existing) => existing.id !== item.id), item],
    })),
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
  clearItems: () => set({ items: [] }),
}))

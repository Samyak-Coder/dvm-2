import {create} from 'zustand'

export const useStore = create((set) => ({
  selected: null,
  setSelected: (item) => set({ selected: item }),
  clearSelected: () => set({ selected: null }),
}))

const useLike = create((set) => ({
  like: 0,
  increasePopulation: () => set((state) => ({ like: state.like + 1 })),
  removeLike: () => set({ like: 0 }),
  updateLike: (newLike) => set({ like: newLike }),
}))
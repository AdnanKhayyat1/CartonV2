import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const useCellStore = create(
  devtools((set) => ({
    cells: [],
    initCells: (cells) => set(() => ({ cells: cells }), false, "initCells"),
    updateCells: (newCells) =>
      set((state) => ({ cells: [...state.cells, newCells] }),false , "updateCells"),
    updateCellById: (id, newCellData) => {
      set((state) => ({
        cells: state.cells.map((cell) =>
          cell._id === id ? { ...cell, data: newCellData } : cell
        ),
      }), false, "updateCellById");
    },
  }))
);

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import produce from "immer";

export const useTagStore = create(
  devtools((set) => ({
    tags: [],
    updateTags: (newTags) =>
      set(() => ({ tags: newTags }), false, "updateTags"),
  }))
);

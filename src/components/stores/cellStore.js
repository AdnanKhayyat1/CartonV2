import { create } from "zustand";
import { devtools } from "zustand/middleware";
export const useCellStore = create(
  devtools((set) => ({
    _id: "",
    title: "Untitled Block",
    isStarred: false,
    tags: [],
    color: "cornflowerblue",
    data: {},

    updateId: (id) => set(() => ({ _id: id}), false, "update id"),
    updateTitle: (title) => set(() => ({ title: title }), false, "update title"),
    updateIsStarred: (isStarred) => set(() => ({ isStarred: isStarred }), false, "update isStarred"),
    updateTags: (tags) => set(() => ({ tags: tags }), false, "update tags"),
    updateColor: (color) => set(() => ({ color: color }), false, "update tags"),
    updateData: (data) => set(() => ({ data: data }), false, "update data"),
  }))
);

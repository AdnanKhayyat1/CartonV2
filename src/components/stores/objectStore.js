import { create } from "zustand";
import { devtools } from "zustand/middleware";
export const useObjectStore = create(
  devtools((set) => ({
    _id: "",
    title: "",
    bio: "",
    tags: [],
    properties: [],
    isTemplate: false,
    editorID: "",
    icon: "",
    isVisible: "",
    viewType: "",
    createdAt: "",
    updatedAt: "",
    updateId: (id) => set(() => ({ _id: id })),
    updateTitle: (title) => set(() => ({ title: title })),
    updateBio: (bio) => set(() => ({ bio: bio })),
    updateTags: (tags) => set(() => ({ tags: tags })),
    updateIsTemplate: (isTemplate) => set(() => ({ isTemplate: isTemplate })),
    updateProperties: (properties) => set(() => ({ properties: properties })),
    updateEditorID: (editorID) => set(() => ({ editorID: editorID })),
    updateIcon: (icon) => set(() => ({ icon: icon })),
    updateIsVisibile: (isVisible) => set(() => ({ isVisible: isVisible})),
    updateViewType: (viewType) => set(() => ({ viewType: viewType})),
    updateCreatedAt: (createdAt) => set(() => ({ createdAt: createdAt})),
    updateUpdatedAt: (updatedAt) => set(() => ({ updatedAt: updatedAt})),
  }))
);


export default useObjectStore;

import { create } from "zustand";
import { updateObjectInServer } from "../../hooks/objectServices";
import { devtools } from "zustand/middleware";
export const useObjectStore = create(
  devtools((set) => ({
    _id: "",
    title: "",
    bio: "",
    tags: [],
    properties: [],
    isTemplate: false,
    leftColumn: {
      showColumn: true,
      cellIDs: [],
    },
    rightColumn: {
      showColumn: false,
      cellIDs: [],
    },
    updateId: (id) => set(() => ({ _id: id })),
    updateTitle: (title) => set(() => ({ title: title })),
    updateBio: (bio) => set(() => ({ bio: bio })),
    updateTags: (tags) => set(() => ({ tags: tags })),
    updateIsTemplate: (isTemplate) => set(() => ({ isTemplate: isTemplate })),
    updateProperties: (properties) => set(() => ({ properties: properties })),
    updateLeftColumn: (leftColumn) =>
      set(() => ({ leftColumn: leftColumn }), false, "updateLeftColumn"),
    updateRightColumn: (rightColumn) =>
      set(() => ({ rightColumn: rightColumn }), false, "updateRightColumn"),
    addCellToLeftColumn: (id) =>
      set(
        (state) => ({
          leftColumn: {
            ...state.leftColumn,
            cellIDs: [...state.leftColumn.cellIDs, id],
          },
        }),
        false,
        "addCellToLeftColumn"
      ),
    addCellToRightColumn: (id) =>
      set(
        (state) => ({
          rightColumn: {
            ...state.rightColumn,
            cellIDs: [...state.rightColumn.cellIDs, id],
          },
        }),
        false,
        "addCellToRightColumn"
      ),
  }))
);

useObjectStore.subscribe((state) => {
  // console.log('SUBSCRIBE STATE', state);
  // updateObjectInServer({
  //   title: state.title,
  //   bio: state.bio,
  //   tags: state.tags,
  //   isTemplate: state.isTemplate,
  //   properties: state.properties,
  //   leftCol: state.leftColumn,
  //   rightCol: state.rightColumn,
  //   _id: state._id,
  // });
});

export default useObjectStore;

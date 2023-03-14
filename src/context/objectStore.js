import { create} from 'zustand';
const _ = create((set) => ({
    title: "",
    bio: "",
    properties: [],
    leftColumn: {
      showColumn: true,
      cellIDs: [],
    },
    rightColumn: {
      showColumn: false,
      cellsIDs: [],
    },
    updateTitle: (title) => set(() => ({ title: title })),
    updateBio: (bio) => set(() => ({ bio: bio })),
    updateProperties: (properties) => set(() => ({ properties: properties })),
    updateLeftColumn: (leftColumn) => set(() => ({ leftColumn: leftColumn })),
    updateRightColumn: (rightColumn) => set(() => ({ rightColumn: rightColumn })),
    addCellToLeftColumn: (id) =>
      set((state) => ({
        leftColumn: {
          ...state.leftColumn,
          cellIDs: [...state.leftColumn.cellIDs, id],
        },
      })),
    addCellToRightColumn: (id) =>
      set((state) => ({
        rightColumn: {
          ...state.rightColumn,
          cellIDs: [...state.rightColumn.cellIDs, id],
        },
      })),
  }));
  
  useObjectStore.subscribe((state) => updateObjectInServer({
    title: state.title,
    bio: state.bio,
    properties: state.properties,
    leftCol: state.leftColumn,
    rightCol: state.rightColumn,
    _id: '640d58cd5f5d6476f60aaa76'
  
  }));
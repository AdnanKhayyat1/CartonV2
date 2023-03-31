import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { persist } from "zustand/middleware";
export const useAuthStore = create(
  devtools((set) => ({
    userID: "",
    isSidebarOpen: false,
    updateUserID: (userID) =>
      set(() => ({ userID: userID }), false, "updateUserID"),
    updateIsSidebarOpen: (isSidebarOpen) =>
      set(
        () => ({ isSidebarOpen: isSidebarOpen }),
        false,
        "updateIsSidebarOpen"
      ),
  }))
);

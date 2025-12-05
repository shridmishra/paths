
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AppState {
  sidebarOpen: boolean;
  sidebarOpenMobile: boolean;
  setSidebarOpen: (open: boolean) => void;
  setSidebarOpenMobile: (open: boolean) => void;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      sidebarOpenMobile: false,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setSidebarOpenMobile: (open) => set({ sidebarOpenMobile: open }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    }),
    {
      name: 'sidebar-storage',
      storage: createJSONStorage(() => localStorage), 
    }
  )
);

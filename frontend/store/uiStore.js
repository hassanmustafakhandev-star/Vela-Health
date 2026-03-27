import { create } from 'zustand';

const useUiStore = create((set) => ({
  sidebarOpen: true,
  toasts: [],
  activeModal: null,

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  addToast: (message, type = 'info') => {
    const id = Date.now().toString();
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }]
    }));
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id)
      }));
    }, 3000);
  },

  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter((t) => t.id !== id)
  })),

  openModal: (id) => set({ activeModal: id }),

  closeModal: () => set({ activeModal: null }),
}));

export default useUiStore;

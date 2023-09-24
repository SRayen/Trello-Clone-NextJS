import { create } from "zustand";
interface ModalStore {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  isOpen: false,
  openModal: () => set((state) => ({ isOpen: true })),
  closeModal: () => set((state) => ({ isOpen: false })),
}));

import { create } from "zustand";

export const useStore = create((set) => ({
    keyword: "",
    setKeyword: (data) => set(() => ({ keyword: data })),

}));

import { defineStore } from "pinia";
import { store } from "@/store";

export const useThemeStore = defineStore("theme", () => {
  const theme = ref((uni.getStorageSync("theme") || "light") as "light" | "dark");

  const setTheme = (v: "light" | "dark") => {
    uni.setStorageSync("theme", v);
    theme.value = v;
  };

  return { theme, setTheme };
});

export function useThemeStoreHook() {
  return useThemeStore(store);
}

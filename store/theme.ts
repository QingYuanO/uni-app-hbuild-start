import type { ConfigProviderThemeVars } from "@wot-ui/ui/components/wd-config-provider/types";
import { defineStore } from "pinia";
import { store } from "@/store";

export const useThemeStore = defineStore("theme", () => {
  const theme = ref((uni.getStorageSync("theme") || "light") as "light" | "dark");

  const setTheme = (v: "light" | "dark") => {
    uni.setStorageSync("theme", v);
    theme.value = v;
  };
  const themeVars: ConfigProviderThemeVars = {
    // colorTheme: "#637BE7",
  };
  return { theme, setTheme, themeVars };
});

export function useThemeStoreHook() {
  return useThemeStore(store);
}

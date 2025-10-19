import { defineStore } from "pinia";
import { store } from "@/store";

export const useI18nStore = defineStore("i18n", () => {
  const locale = ref((uni.getStorageSync("lang") || "zh-cn") as string);

  const isAutoLang = ref((uni.getStorageSync("isAutoLang") || "1") as "0" | "1");

  const setLang = (v?: string) => {
    if (v) {
      uni.setStorageSync("lang", locale);
    }
    locale.value = v || localStorage.getItem("lang") || "";
  };

  const setIsAutoLang = (v: "0" | "1") => {
    uni.setStorageSync("isAutoLang", v);
    isAutoLang.value = v;
  };

  return { locale, isAutoLang, setLang, setIsAutoLang };
});

export function useI18nStoreHook() {
  return useI18nStore(store);
}

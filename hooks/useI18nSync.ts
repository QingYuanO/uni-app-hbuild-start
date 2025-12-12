import { computed } from "vue";
import Locale from "wot-design-uni/locale";
import i18n from "@/i18n";

export type SupportedLocalesType = "zh-CN" | "en-US";
export const SUPPORTED_LOCALES = [
  "zh-CN",
  "en-US",
];

function setLocale(locale: string) {
  if (!SUPPORTED_LOCALES.includes(locale)) {
    console.warn(`不支持的语言: ${locale}，将使用默认语言 zh-CN`);
    locale = "zh-CN";
  }
  uni.setLocale(locale);
  i18n.global.locale.value = locale as SupportedLocalesType;
  uni.setStorageSync("currentLang", locale);
  Locale.use(locale);
  return locale;
}

function initLocale(defaultLocale: string) {
  const storedLocale = uni.getStorageSync("currentLang") || defaultLocale;
  setLocale(storedLocale);
}

interface I18nSyncOptions {
  /** 默认语言 */
  defaultLocale?: string;
}

/**
 * 国际化同步hook
 * @param options 配置选项
 * @returns 国际化相关方法和状态
 */
export function useI18nSync() {
  const currentLang = computed(() => i18n.global.locale.value);

  return {
    currentLang,
    initLocale,
    setLocale: (locale: string) => setLocale(locale),
    supportedLocales: SUPPORTED_LOCALES,
  };
}

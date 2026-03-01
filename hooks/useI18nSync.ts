import { computed } from "vue";
import { Locale } from "wot-design-uni";
import i18n from "@/i18n";

export type SupportedLocalesType = "zh-CN" | "en-US";

export const SUPPORTED_LOCALES_DATA = {
  en: "en-US",
  cn: "zh-CN",
};
export const SUPPORTED_LOCALES = [
  "zh-CN",
  "en-US",
];

function setLocale(locale: string, isInit?: boolean) {
  const user = useUserStore();
  if (!SUPPORTED_LOCALES.includes(locale)) {
    console.warn(`不支持的语言: ${locale}，将使用默认语言 zh-CN`);
    locale = "zh-CN";
  }

  i18n.global.locale.value = locale as SupportedLocalesType;
  uni.setStorageSync("currentLang", locale);

  Locale.use(locale);

  if (!isInit) {
    if (user.token) {
      // uni.$api.common.languageUpdate({ language: locale as SupportedLocalesType }, { extraConfig: { showLoading: false } }).then((res) => {
      //   uni.setLocale(locale);
      // });
    }
    else {
      uni.setLocale(locale);
    }
  }
  return locale;
}

function initLocale(defaultLocale: string) {
  const storedLocale = uni.getStorageSync("currentLang") || defaultLocale;
  setLocale(storedLocale, true);
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
export function useI18nSync(options?: I18nSyncOptions) {
  const { defaultLocale = "zh-CN" } = options || {};
  const currentLang = computed(() => i18n.global.locale.value);

  return {
    currentLang,
    initLocale,
    setLocale: (locale: string) => setLocale(locale),
    supportedLocales: SUPPORTED_LOCALES,
  };
}

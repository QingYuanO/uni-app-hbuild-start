import { createI18n } from "vue-i18n";

import en from "@/i18n/lang/en";
import zhCn from "@/i18n/lang/zh-cn";
import { useI18nStoreHook } from "@/store/i18n";

const messages = {
  "zh-cn": {
    message: {
      ...zhCn,
    },
  },
  "en": {
    message: {
      ...en,
    },
  },
};

const config = useI18nStoreHook();
const i18n = createI18n({
  legacy: false,
  locale: config.locale,
  fallbackLocale: config.locale,
  messages,
});

export default i18n;

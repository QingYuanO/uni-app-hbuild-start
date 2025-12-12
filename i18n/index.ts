import { createI18n } from "vue-i18n";
import { Locale } from "wot-design-uni";
import WotEnUS from "wot-design-uni/locale/lang/en-US";
import en from "@/i18n/lang/en";
import zhCn from "@/i18n/lang/zh-cn";

function interpolateTemplate(template: string, values: any[]): string {
  return template.replace(/\{(\d+)\}/g, (_, index) => values[index] ?? "");
}

Locale.add({ "en-US": WotEnUS });
const messages = {
  "zh-CN": {
    ...zhCn,
  },
  "en-US": {
    ...en,
  },
};

const i18n = createI18n({
  locale: uni.getStorageSync("currentLang") || "zh-CN", // 默认语言
  fallbackLocale: "zh-CN", // 回退语言
  messages, // 语言包
  legacy: false, // 启用Composition API模式
});

// 扩展t函数，支持数组参数插值
// 这是解决小程序和App端不支持插值方式的关键步骤
const originalT = i18n.global.t;
i18n.global.t = ((key: string | number, param1?: any, param2?: any) => {
  const result = originalT(key, param1, param2);
  // 检测是否传入了数组参数，如果是则使用我们的插值方法处理
  if (Array.isArray(param1)) {
    return interpolateTemplate(result, param1);
  }
  return result;
}) as typeof i18n.global.t;

// 同步组件库语言
Locale.use(i18n.global.locale.value);
uni.setLocale(i18n.global.locale.value);

export default i18n;

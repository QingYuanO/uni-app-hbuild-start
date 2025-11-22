import type { CnOptions } from "@weapp-tailwindcss/variants";
import { cn as tvCn } from "@weapp-tailwindcss/variants";
import i18n from "@/i18n";

const { t } = i18n.global;

/**
 * 获取小程序路由EventChannel
 * @returns UniApp.EventChannel
 */
export function getOpenerEventChannel() {
  const instance = getCurrentInstance()?.proxy;
  const eventChannel = instance?.getOpenerEventChannel?.() as UniApp.NavigateToSuccessOptions["eventChannel"] | undefined;

  return eventChannel;
}

/**
 * 换算单位
 * @param num 数值
 * @returns 根据尺寸转换后的值
 */
export function pt(num: number) {
  const { screenWidth } = uni.getWindowInfo();
  return num * (screenWidth / 375);
}

export function getCurrentPage() {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  return currentPage;
}

// uuid
export function uuid(): string {
  const s: any[] = [];
  const hexDigits = "0123456789abcdef";
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4";
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
  s[8] = s[13] = s[18] = s[23] = "-";

  return s.join("");
}

/**
 * 复制内容
 * @param val
 */
export function copyText(val: string) {
  uni.setClipboardData({
    data: val,
    success() {
      uni.showToast({
        title: t("message.Tip.Copy_Success"),
        icon: "none",
        duration: 2000,
      });
    },
  });
}

export function toJumpLinks(url: string) {
  if (!url)
    return;

  // #ifdef H5
  window.open(url, "_blank");
  // #endif

  // #ifdef APP-PLUS
  plus.runtime.openURL(url);

  // #endif
}
export function cn<T extends CnOptions>(...classes: T) {
  return tvCn(classes)({
    twMerge: true,
  });
}

export * from "./animator";
export * from "./app";
export * from "./constant";
export * from "./lang";
export * from "./reg";
export * from "./storage";
export * from "./ui";

import { isArray, isEmpty } from "lodash-es";

import { computed, getCurrentInstance, nextTick, ref } from "vue";
import i18n from "@/i18n";

import { COLOR, WINDOW_INFO } from "./constant";

const { t } = i18n.global;

// 获取父组件
export function getParent(name: string, k1: string[], k2?: string[]) {
  const { proxy }: any = getCurrentInstance();

  const d = ref();
  const n = 10;

  const next = () => {
    let parent = proxy.$parent;

    while (parent) {
      if (parent.$options.name !== name) {
        parent = parent.$parent;
      }
      else {
        if (isArray(k2)) {
          nextTick(() => {
            const child: any = {};

            (k2 || []).forEach((key: string) => {
              if (proxy[key]) {
                child[key] = proxy[key];
              }
            });

            if (!parent.__children) {
              parent.__children = [];
            }

            if (!isEmpty(child)) {
              parent.__children.push(child);
            }
          });
        }

        return (k1 || []).reduce((res: any, key: string) => {
          res[key] = parent[key];

          return res;
        }, {});
      }
    }

    return parent || d.value;
  };

  return computed(() => next());
}

// 获取元素位置信息
export async function getRect(selector: string): Promise<UniApp.NodeInfo | UniApp.NodeInfo[]> {
  return new Promise((resolve) => {
    uni
      .createSelectorQuery()
      .select(selector)
      .boundingClientRect((res) => {
        resolve(res);
      })
      .exec();
  });
}

export function setStatusBarColor(type: "light" | "dark") {
  uni.setNavigationBarColor({
    frontColor: type === "light" ? "#ffffff" : "#000000",
    // backgroundColor: COLOR.bg,
  });
}

// 获取自定义navbar高度
export function getCustomNavHeight() {
  let headerHeight = 44;

  // #ifdef MP-WEIXIN
  const menuButtonBounding = uni.getMenuButtonBoundingClientRect();
  headerHeight = menuButtonBounding.top + menuButtonBounding.height + 5;
  // #endif

  // #ifdef APP-PLUS
  const statusBarHeight = uni.getWindowInfo().statusBarHeight;
  headerHeight = 44 + (statusBarHeight ?? 0);
  // #endif

  // // #ifdef H5
  // headerHeight = 0;
  // // #endif

  return headerHeight;
}

export function getSafeArea() {
  const safeBottom = WINDOW_INFO.screenHeight - (WINDOW_INFO?.safeArea?.bottom ?? 0);
  const safeTop = WINDOW_INFO.safeArea?.top;
  const safeHeight = WINDOW_INFO.safeArea?.height;

  return {
    safeBottom,
    safeTop,
    safeHeight,
    statusBarHeight: WINDOW_INFO.statusBarHeight,
  };
}

export function getScrollHeight({
  isTabbar,
  extraHeight,
}: {
  isTabbar?: boolean;
  extraHeight: number;
}) {
  return WINDOW_INFO.windowHeight - getCustomNavHeight() - extraHeight - (isTabbar ? (60 + getSafeArea().safeBottom) : 0);
}

/**
 * 获取常规Model 参数
 */
export function getModelOption() {
  return {
    cancelText: t("message.All.Cancel"),
    confirmText: t("message.All.Confirm"),
    confirmColor: COLOR.primary,
  } as UniNamespace.ShowModalOptions;
}

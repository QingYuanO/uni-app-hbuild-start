import { isArray, isEmpty } from "lodash-es";

import { computed, getCurrentInstance, nextTick, ref } from "vue";
import i18n from "@/i18n";

import { COLOR } from "./constant";

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
    backgroundColor: COLOR.bg,
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

  return headerHeight;
}

export function getSafeArea() {
  const windowInfo = uni.getWindowInfo();
  const safeBottom = windowInfo.screenHeight - (windowInfo?.safeArea?.bottom ?? 0);
  const safeTop = windowInfo.safeArea?.top;
  const safeHeight = windowInfo.safeArea?.height;
  return {
    safeBottom,
    safeTop,
    safeHeight,
  };
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

/**
 * 获取图片主题颜色
 * @param path 图片的路径
 * @param canvasId 画布id
 * @param success 获取图片颜色成功回调，主题色的RGB颜色值
 * @param fail 获取图片颜色失败回调
 * @param instance 自定义组件中使用要传
 * @example
  getImageThemeColor({
        instance,
        path: currentItem.avatarImage?.[0] ?? '',
        canvasId: 'canvas',
        success: (res) => {
          console.log(res)
          textColor.value = res.textColor
        },
        fail: () => {
          console.log('fail')
        },
      })
 */
export function getImageThemeColor(prams: { instance?: any; path: string; canvasId: string; success: (data: { color: string; textColor: string }) => void; fail: () => void }) {
  const { path, canvasId, instance, success } = prams;

  const query = uni.createSelectorQuery();

  if (instance) {
    query.in(instance?.proxy);
  }

  query
    .select(`#${canvasId}`) // 在 WXML 中填入的 id
    .node((res) => {
      console.log(res);
      const canvas = res.node;

      // Canvas 画布的实际绘制宽高
      const renderWidth = canvas.width;
      const renderHeight = canvas.height;
      // Canvas 绘制上下文
      const ctx = canvas.getContext("2d");

      console.log(ctx);

      // 图片绘制尺寸
      const imgWidth = renderWidth;
      const imgHeight = renderHeight;

      const image = canvas.createImage();
      image.onload = () => {
        ctx.drawImage(
          image,
          0,
          0,
          imgWidth,
          imgHeight,
        );
        const imageData = ctx.getImageData(0, 0, imgWidth, imgHeight);
        const data = imageData.data;

        let r = 1;
        let g = 1;
        let b = 1;
        // 获取所有像素的累加值
        for (let row = 0; row < imgHeight; row++) {
          for (let col = 0; col < imgWidth; col++) {
            if (row === 0) {
              r += data[imgWidth * row + col];
              g += data[imgWidth * row + col + 1];
              b += data[imgWidth * row + col + 2];
            }
            else {
              r += data[(imgWidth * row + col) * 4];
              g += data[(imgWidth * row + col) * 4 + 1];
              b += data[(imgWidth * row + col) * 4 + 2];
            }
          }
        }
        // 求rgb平均值
        r /= imgWidth * imgHeight;
        g /= imgWidth * imgHeight;
        b /= imgWidth * imgHeight;
        // 四舍五入
        r = Math.round(r);
        g = Math.round(g);
        b = Math.round(b);

        // 计算亮度（感知亮度公式）
        const brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b;

        // brightness > 128 背景偏亮 → 用黑字
        success({ color: [r, g, b].join(","), textColor: brightness > 128 ? "#000" : "#fff" });
      };

      image.src = path;
    })
    .exec();
}

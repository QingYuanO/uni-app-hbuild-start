import type { ToastOptions } from "@wot-ui/ui/components/wd-toast/types";
import { defineStore } from "pinia";
import { router } from "@/router";

interface GlobalToast {
  toastOptions: ToastOptions;
  currentPage: string;
}

const defaultOptions: ToastOptions = {
  duration: 2000,
  show: false,
  iconColor: "#000000",
};
export const useGlobalToast = defineStore("global-toast", {
  state: (): GlobalToast => ({
    toastOptions: defaultOptions,
    currentPage: "",
  }),
  getters: {},
  actions: {
  // 打开Toast
    show(option: ToastOptions | string) {
      this.currentPage = router.path;
      const options = CommonUtil.deepMerge(defaultOptions, typeof option === "string" ? { msg: option } : option) as ToastOptions;
      this.toastOptions = CommonUtil.deepMerge(options, {
        show: true,
        position: options.position,
      }) as ToastOptions;
    },
    // 成功提示
    success(option: ToastOptions | string) {
      this.show(CommonUtil.deepMerge({
        iconName: "success",
        duration: 1500,
      }, typeof option === "string" ? { msg: option } : option) as ToastOptions);
    },
    // 关闭提示
    error(option: ToastOptions | string) {
      this.show(CommonUtil.deepMerge({
        iconName: "error",
      }, typeof option === "string" ? { msg: option } : option) as ToastOptions);
    },
    // 常规提示
    info(option: ToastOptions | string) {
      this.show(CommonUtil.deepMerge({
        iconName: "info",
      }, typeof option === "string" ? { msg: option } : option) as ToastOptions);
    },
    // 警告提示
    warning(option: ToastOptions | string) {
      this.show(CommonUtil.deepMerge({
        iconName: "warning",
      }, typeof option === "string" ? { msg: option } : option) as ToastOptions);
    },
    // 关闭Toast
    close() {
      this.toastOptions = defaultOptions;
      this.currentPage = "";
    },
  },
});

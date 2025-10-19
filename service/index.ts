import AdapterUniapp from "@alova/adapter-uniapp";
import { createAlova } from "alova";
import VueHook from "alova/vue";
import i18n from "@/i18n";

const { t } = i18n.global;

function getBaseUrl() {
  if (process.env.NODE_ENV === "development") {
    return "http://192.168.124.50:9096";
  }
  else {
    return "xxx";
  }
}

const test = {
  baseUrl: "http://192.168.124.18:9096",
};

// const baseUrl = test.baseUrl;
// const domainUrl = test.domainUrl;

const baseUrl = getBaseUrl();

if (process.env.NODE_ENV === "development") {
  console.log(`开发环境-BaseUrl-${baseUrl}`);
}

const alovaInst = createAlova({
  baseURL: baseUrl,
  beforeRequest(method) {
    const hasLoading = method.meta?.hasLoading ?? true;
    const loadingText = method.meta?.loadingText;

    if (hasLoading) {
      uni.showLoading({
        title: loadingText || "请求中...",
      });
    }
  },
  responded: {
    onSuccess: async (response, method) => {
      if (response.statusCode >= 400) {
        throw new Error(response.errMsg);
      }

      const successResponse = response as UniApp.RequestSuccessCallbackResult;

      const data = successResponse.data as CustomResponseData;

      const header = successResponse.header;

      const hasErrorTip = method.meta?.hasErrorTip ?? true;

      if (data.code !== 200) {
        const toLogin = () => {
          setTimeout(() => {
            uni.removeStorageSync("userData");
            uni.removeStorageSync("token");
            uni.reLaunch({
              url: "/pages/login/index",
            });
          }, 500);
        };

        if (hasErrorTip) {
          setTimeout(() => {
            uni.showToast({
              title: data.msg ? t(data.msg) || "Error" : "Error",
              icon: "none",
              duration: 2000,
            });
          }, 300);
        }

        if (data.code === 2003) {
          toLogin();
        }
        if (data.code === 2005) {
          toLogin();
        }
        throw new Error(t(data.msg) || "Error");
      }

      return data.data;
    },

    onError: (err, method) => {
      const hasErrorTip = method.meta?.hasErrorTip ?? true;

      if (hasErrorTip) {
        uni.showToast({
          title: err.message ? err.message : "Error",
          icon: "none",
          duration: 2000,
        });
      }
    },

    onComplete: async (method) => {
      const hasLoading = method.meta?.hasLoading ?? true;
      if (hasLoading) {
        uni.hideLoading();
      }
    },
  },
  ...AdapterUniapp(),
  statesHook: VueHook,
});

export default alovaInst;

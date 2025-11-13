import { un } from "@uni-helper/uni-network";

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

const instance = un.create({
  baseUrl,
});

// 添加请求拦截器
instance.interceptors.request.use(
  (config) => {
    console.log(config);

    config.extraConfig = {
      showLoading: true,
      showErrorToast: true,
      loadingText: "请求中...",
      delay: 500,
      ...(config.extraConfig ?? {}),
    };

    const hasLoading = config.extraConfig?.showLoading ?? true;
    const loadingText = config.extraConfig?.loadingText;

    if (hasLoading) {
      const timer = setTimeout(() => {
        uni.showLoading({
          title: loadingText || "请求中...",
        });
      }, config.extraConfig?.delay ?? 0);
      config.extraConfig.timer = timer;
    }
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  },
);

// 添加响应拦截器
instance.interceptors.response.use(
  (response) => {
    console.log(response);

    const extraConfig = (response.config?.extraConfig ?? {}) as ExtraConfig;

    if (extraConfig.showLoading) {
      uni.hideLoading();
    }

    if (extraConfig.timer) {
      clearTimeout(extraConfig.timer);
    }

    // 2xx 范围内的状态码都会触发该函数
    // 对响应数据做点什么
    return response;
  },
  (error) => {
    // 超出 2xx 范围的状态码都会触发该函数
    // 对响应错误做点什么
    return Promise.reject(error);
  },
);

export default instance;

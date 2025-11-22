import instance from "..";

export function getSingleImg() {
  return instance.get<AipResponse["getSingleImg"]>("https://api.waifu.pics/sfw/waifu", {
    baseUrl: "",
    meta: {
      showLoading: false,
      // loadingText: "请求中...",
    },
  });
}

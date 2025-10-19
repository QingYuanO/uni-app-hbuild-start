import i18n from "@/i18n";

import { COLOR } from "./constant";

const { t } = i18n.global;

/**
 * 跳转到平台对应的应用商店
 */
export function jumpToAppMarket() {
  const googlePlay = "com.android.vending";

  const androidPackName = "xxx";
  if (plus.os.name == "Android") {
    const Uri = plus.android.importClass("android.net.Uri") as any;
    const Intent = plus.android.importClass("android.content.Intent") as any;
    const main = plus.android.runtimeMainActivity() as any;

    const uri = Uri.parse(`market://details?id=${androidPackName}`);
    const intent = new Intent(Intent.ACTION_VIEW, uri);
    // 选择进入商店
    intent.setPackage(googlePlay);
    intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK;
    // 没有该商店应用
    if (intent.resolveActivity(main.getPackageManager()) !== null) {
      main.startActivity(intent);
    }
    else {
      // 跳转浏览器
      const uri = Uri.parse(`https://play.google.com/store/apps/details?id=${androidPackName}`);
      const intent = new Intent(Intent.ACTION_VIEW, uri);
      intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK;
      intent.setPackage("com.android.browser");
      main.startActivity(intent);
    }
  }
  else {
    plus.runtime.openURL("itms-apps://itunes.apple.com/cn/app/idxxx?mt=8");
  }
}

/**
 * 检查版本更新
 * @param businessesCode
 * @param isManualCheck
 */
export async function checkVersion(businessesCode: number, isManualCheck?: boolean) {
  try {
    const version = "";

    const updateVersionTip = uni.getStorageSync("updateVersionTip");

    const now = new Date().getTime();

    const isShowTip = !updateVersionTip || now - updateVersionTip > 24 * 60 * 60 * 1000;

    plus.runtime.getProperty(plus.runtime.appid!, (widgetInfo) => {
      if (!widgetInfo?.versionCode || !version) {
        return;
      }

      if (Number(widgetInfo?.versionCode) < Number(version) && (isShowTip || isManualCheck)) {
        uni.showModal({
          title: t("message.Tip.App_Update_Title"),
          content: t("message.Tip.App_Update_Tip"),
          confirmText: t("message.All.Confirm"),
          cancelText: t("message.All.Neglect"),
          confirmColor: COLOR.primary,
          success: (res) => {
            uni.setStorageSync("updateVersionTip", new Date().getTime());

            if (res.confirm) {
              jumpToAppMarket();
            }
          },
        });
      }
      else {
        if (isManualCheck) {
          uni.showToast({
            title: t("message.Tip.Is_Newest_Version"),
            icon: "none",
          });
        }
      }
    });
  }
  catch (error) {
    console.log(error);
  }
}

// 请求通知权限
export function requestNotificationPermission() {
  if (plus.os.name !== "Android") {
    return;
  }

  const permissionName = "android.permission.POST_NOTIFICATIONS";
  const { notificationAuthorized } = uni.getAppAuthorizeSetting();

  if (notificationAuthorized === "authorized")
    return;

  plus.android.requestPermissions([permissionName], (e) => {
    if (e.deniedPresent.length > 0) {
      // 权限被拒绝
    }
  });
}

import { ANDROID_PERMISSION_ID, AppPermission } from "@/utils";

interface UseGpsOptions {
  onShow?: (data: UniApp.GetLocationSuccess) => void;
}
export function useGps(options: UseGpsOptions = {}) {
  const isRequiring = ref(false);

  const hasLocationPermission = ref(false);
  const feedback = useFeedback();

  async function judgePermissionLocation() {
    isRequiring.value = true;
    let hasPermission = true;
    // #ifdef APP-PLUS

    if (!AppPermission.checkSystemEnableLocation()) {
      feedback.messageBox.alert("请开启系统定位").then(() => {
        AppPermission.gotoAppPermissionSetting();
      }).finally(() => {
        isRequiring.value = false;
      });
      hasPermission = false;
      hasLocationPermission.value = hasPermission;
      return hasPermission;
    }

    if (isAndroid) {
      const result = await AppPermission.requestAndroidPermission(ANDROID_PERMISSION_ID.ACCESS_FINE_LOCATION);
      hasPermission = result === 1;
    }
    else {
      hasPermission = AppPermission.judgeIosPermission("location");
    }

    if (!hasPermission) {
      feedback.messageBox.confirm("请开启位置权限").then(() => {
        AppPermission.gotoAppPermissionSetting();
      }).finally(() => {
        isRequiring.value = false;
      });
    }

    // #endif
    hasLocationPermission.value = hasPermission;
    return hasPermission;
  }

  async function getLocation() {
    try {
      if (isRequiring.value)
        return;

      isRequiring.value = true;

      const position = await uni.getLocation({ type: "wgs84" });
      hasLocationPermission.value = true;
      isRequiring.value = false;

      options.onShow?.(position);
      return position;
    }
    catch (error: any) {
      console.log(error);

      if (error.errMsg.includes("getLocation:fail")) {
        judgePermissionLocation();
      }
    }
  }

  onShow(() => {
    if (options.onShow) {
      getLocation();
    }
  });

  return {
    isRequiring,
    hasLocationPermission,
    getLocation,
    judgePermissionLocation,
  };
}

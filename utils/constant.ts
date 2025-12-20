export const WINDOW_INFO = uni.getWindowInfo();

export const DEVICE_INFO = uni.getDeviceInfo() as UniNamespace.GetDeviceInfoResult & { osName: "ios" | "android" | "windows" | "mac" | "linux" };

export const COLOR = {
  primary: "#347aff",
  bg: "#eceff7",
} as const;

export const ANDROID_PERMISSION_ID = {
  /**
   * 位置权限
   */
  ACCESS_FINE_LOCATION: "android.permission.ACCESS_FINE_LOCATION",
  /**
   * 模糊位置权限(蓝牙\ble依赖)
   */
  ACCESS_COARSE_LOCATION: "android.permission.ACCESS_COARSE_LOCATION",
  /**
   * 摄像头权限
   */
  CAMERA: "android.permission.CAMERA",
  /**
   * 外部存储(含相册)读取权限
   */
  READ_EXTERNAL_STORAGE: "android.permission.READ_EXTERNAL_STORAGE",
  /**
   * 外部存储(含相册)写入权限
   */
  WRITE_EXTERNAL_STORAGE: "android.permission.WRITE_EXTERNAL_STORAGE",
  /**
   * 麦克风权限
   */
  RECORD_AUDIO: "android.permission.RECORD_AUDIO",
  /**
   * 通讯录读取权限
   */
  READ_CONTACTS: "android.permission.READ_CONTACTS",
  /**
   * 通讯录写入权限
   */
  WRITE_CONTACTS: "android.permission.WRITE_CONTACTS",
  /**
   * 日历读取权限
   */
  READ_CALENDAR: "android.permission.READ_CALENDAR",
  /**
   * 日历写入权限
   */
  WRITE_CALENDAR: "android.permission.WRITE_CALENDAR",
  /**
   * 短信读取权限
   */
  READ_SMS: "android.permission.READ_SMS",
  /**
   * 短信发送权限
   */
  SEND_SMS: "android.permission.SEND_SMS",
  /**
   * 接收新短信权限
   */
  RECEIVE_SMS: "android.permission.RECEIVE_SMS",
  /**
   * 获取手机识别码等信息的权限
   */
  READ_PHONE_STATE: "android.permission.READ_PHONE_STATE",
  /**
   * 拨打电话权限
   */
  CALL_PHONE: "android.permission.CALL_PHONE",
  /**
   * 获取通话记录权限
   */
  READ_CALL_LOG: "android.permission.READ_CALL_LOG",

};

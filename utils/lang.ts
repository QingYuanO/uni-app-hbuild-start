export const { platform } = uni.getDeviceInfo();

// 是否安卓
export const isAndroid = platform === "android";

// 是否苹果
export const isIos = platform === "ios";

// 是否小数
export function isDecimal(value: any): boolean {
  return String(value).length - String(value).indexOf(".") + 1 > 0;
}

// 正则表达式验证邮箱
export function isEmail(email: string) {
  const emailReg = /^([a-z0-9])(\w|-)+@[a-z0-9]+\.([a-z]{2,4})$/i;
  return emailReg.test(email);
}

// 正则表达式验证大多数手机格式
export function isCommonPhone(email: string) {
  const numberReg = /^\d*$/;
  return numberReg.test(email);
}

// 判断数字的位数
export function isNumberOfQuantity(quantity: number, text: string) {
  return new RegExp(`^\\d{${quantity}}$`).test(text);
}

export function isObject(obj: any) {
  return Object.prototype.toString.call(obj) === "[object Object]";
}

// 是否为空
export function isEmpty(val: any) {
  return val === "" || val === null || val === undefined;
}

/**
 * 替换空格和换行
 * @param val
 */
export function filterSpacesAndNewLines(val: string) {
  if (val) {
    return val.replace(/[\r\n\t]+/g, "").trim();
  }
  else {
    return val;
  }
}

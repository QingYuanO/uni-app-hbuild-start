export default function useAccessFun<T extends FunctionArgs>(fun: T, option?: { isTipLogin?: boolean; access?: string[] }) {
  const { isTipLogin = true, access } = option ?? {};
  const token = useLocalState<string>("token");
  const userAccess = useLocalState<string[]>("access");

  return (...args: ArgumentsType<T>) => {
    if (!token.value) {
      if (isTipLogin) {
        uni.showModal({
          content: "请登录!",
          success(res) {
            if (res.confirm) {
              // 去登录页
              // toLoginPage();
            }
          },
        });
      }
      return;
    }
    if (access && !access?.some(item => userAccess.value?.includes(item))) {
      uni.showModal({
        content: "没有访问权限!",
        showCancel: false,
        confirmText: "关闭",
        confirmColor: "#000",
      });
      return;
    }
    fun(args);
  };
}

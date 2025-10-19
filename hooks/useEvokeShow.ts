// 监听外部唤起app
export function useEvokeShow(fun: (data: Record<string, string>) => void) {
  onLoad(() => {
    plus.runtime.arguments = "";
  });

  onShow(() => {
    setTimeout(() => {
      const args = plus.runtime.arguments;

      if (args) {
        // 处理args参数，如直达到某新页面等

        const paramsStr = args.split("?")[1];

        if (!paramsStr)
          return;

        const params = paramsStr.split("&").reduce(
          (acc, cur) => {
            const [key, value] = cur.split("=");
            acc[key] = value;
            return acc;
          },
          {} as Record<string, string>,
        );

        fun(params);
      }
    }, 200);
  });

  onHide(() => {
    plus.runtime.arguments = "";
  });

  onUnload(() => {
    plus.runtime.arguments = "";
  });
}

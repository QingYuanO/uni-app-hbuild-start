import type i18n from "@/i18n";

// 声明全局命名空间
declare global {
  interface Uni { }

  type ArgumentsType<T> = T extends (...args: infer U) => any ? U : never;
  type AnyFn = (...args: any[]) => any;

  type WrapFn<T extends AnyFn> = (...args: ArgumentsType<T>) => ReturnType<T>;

  type FunctionArgs<Args extends any[] = any[], Return = void> = (...args: Args) => Return;

  interface FunctionWrapperOptions<Args extends any[] = any[], This = any> {
    fn: FunctionArgs<Args, This>;
    args: Args;
    thisArg: This;
  }

}

// 声明导出
export {

};

declare module "vue" {
  interface ComponentCustomProperties {
    $t: typeof i18n.global.t;
  }
}

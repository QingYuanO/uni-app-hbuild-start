import path, { resolve } from "node:path";
// @ts-ignore
import uni from "@dcloudio/vite-plugin-uni";
import tailwindcss from "@tailwindcss/postcss";
import Components from "@uni-helper/vite-plugin-uni-components";
import AutoImport from "unplugin-auto-import/vite";
import { defineConfig } from "vite";
import cssMacro from "weapp-tailwindcss/css-macro/postcss";
import { UnifiedViteWeappTailwindcssPlugin as uvwt } from "weapp-tailwindcss/vite";
// 注意： 打包成 h5 和 app 都不需要开启插件配置
const isH5 = process.env.UNI_PLATFORM === "h5";
const isApp = process.env.UNI_PLATFORM === "app";
const WeappTailwindcssDisabled = isH5 || isApp;

// https://vitejs.dev/config/
export default defineConfig({
  resolve: { alias: [{ find: "@", replacement: resolve(__dirname, "./") }] },
  plugins: [
    Components({ dts: "types/components.d.ts", dirs: ["components"], resolvers: [] }),
    uni(),
    uvwt({
      disabled: WeappTailwindcssDisabled,
      rem2rpx: true,
      cssPresetEnv: {},
      customAttributes: {
        "*": [/[A-Za-z-]*[Cc]lass/, "custom-class"],
      },
      cssEntries: [path.resolve(__dirname, "./tailwind.css")],
    }),
    AutoImport({
      imports: [
        "vue",
        "uni-app",
        "pinia",
        "vue-i18n",
        {
          from: "wot-design-uni",
          imports: ["useToast", "useMessage", "useNotify", "CommonUtil"],
        },
      ],
      dts: "types/auto-imports.d.ts",
      dirs: ["hooks/**", "store/**", "utils/**"],
      vueTemplate: true,
    }),
  ],
  css: {
    postcss: {
      plugins: [
        tailwindcss({
          base: __dirname,
        }),
        cssMacro,
      ],
    },
    preprocessorOptions: { scss: { additionalData: `` } },
  },
  define: {
    __VUE_I18N_FULL_INSTALL__: true,
    __VUE_I18N_LEGACY_API__: false,
  },
  build: {
    minify: false,
    terserOptions: undefined,
    rollupOptions: {},
  },
  esbuild: {
    keepNames: true,
  },
});

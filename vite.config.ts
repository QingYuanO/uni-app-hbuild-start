// import { vueJsx } from '@vitejs/plugin-vue-jsx';
import uni from '@dcloudio/vite-plugin-uni';
import Components from '@uni-helper/vite-plugin-uni-components';
import { WotResolver } from '@uni-helper/vite-plugin-uni-components/resolvers';
import { resolve } from 'path';
import AutoImport from 'unplugin-auto-import/vite';
import { defineConfig } from 'vite';
import { UnifiedViteWeappTailwindcssPlugin as uvwt } from 'weapp-tailwindcss/vite'
import tailwindcss from '@tailwindcss/postcss'


// 注意： 打包成 h5 和 app 都不需要开启插件配置
const isH5 = process.env.UNI_PLATFORM === 'h5';
const isApp = process.env.UNI_PLATFORM === 'app';
const WeappTailwindcssDisabled = isH5 || isApp;

// https://vitejs.dev/config/
export default defineConfig({
	resolve: { alias: [{ find: '@', replacement: resolve(__dirname, './') }] },
	css: {
		postcss: {
			plugins: [
				tailwindcss({
          base: __dirname
        })
			],
		},
		preprocessorOptions: { scss: { additionalData: `` } },
	},
	plugins: [
		Components({ dts: 'types/components.d.ts', dirs: ['components'], resolvers: [WotResolver()] }),
		uni(),
		// vueJsx(),
		uvwt({
			rem2rpx: true,
			tailwindcss: {
				v4: {
					base: __dirname
				}
			}
		}),
		AutoImport({
			imports: [
				'vue',
				'uni-app',
				'pinia',
				'vue-i18n',
				{
					from: 'alova/client',
					imports: ['usePagination', 'useRequest'],
				},
			],
			dts: 'types/auto-imports.d.ts',
			dirs: ['hooks/**', 'store/**', 'utils/**'],
			vueTemplate: true,
		}),
	],
});

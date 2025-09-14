import uni from '@dcloudio/vite-plugin-uni';
import Components from '@uni-helper/vite-plugin-uni-components';
import { WotResolver } from '@uni-helper/vite-plugin-uni-components/resolvers';
import UniKuRoot from '@uni-ku/root';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { resolve } from 'path';
import AutoImport from 'unplugin-auto-import/vite';
import { defineConfig, loadEnv } from 'vite';
import { UnifiedViteWeappTailwindcssPlugin as uvwt } from 'weapp-tailwindcss/vite';

// 注意： 打包成 h5 和 app 都不需要开启插件配置
const isH5 = process.env.UNI_PLATFORM === 'h5';
const isApp = process.env.UNI_PLATFORM === 'app';
const WeappTailwindcssDisabled = isH5 || isApp;

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	return {
		build: { target: 'es6' },
		base: command === 'serve' ? './' : env.VITE_PUBLIC_PATH,
		resolve: { alias: [{ find: '@', replacement: resolve(__dirname, './') }] },
		server: {
			port: env.VITE_PORT as unknown as number,
			// 选项写法
			proxy: {},
			host: true,
		},
		css: {
			postcss: {
				plugins: [
					require('tailwindcss')({
						// 注意此处，手动传入你 `tailwind.config.js` 的绝对路径
						config: resolve(__dirname, './tailwind.config.js'),
					}),
					require('autoprefixer'),
				],
			},
			preprocessorOptions: { scss: { additionalData: `` } },
		},
		plugins: [
			UniKuRoot({ rootFileName: 'AppRoot' }),
			Components({ dts: 'types/components.d.ts', dirs: ['components'], resolvers: [WotResolver()] }),
			uni(),
			vueJsx(),
			uvwt({
				rem2rpx: true,
				disabled: WeappTailwindcssDisabled,
				// 由于 hbuilderx 会改变 process.cwd 所以这里必须传入当前目录的绝对路径
				tailwindcssBasedir: __dirname,
			}),
			AutoImport({
				imports: ['vue', 'uni-app', 'pinia', 'vue-i18n'],
				dts: 'types/auto-imports.d.ts',
				dirs: ['hooks/**', 'store/**', 'utils/**'],
				vueTemplate: true,
			}),
		],
		define: {
			__VUE_I18N_FULL_INSTALL__: true,
			__VUE_I18N_LEGACY_API__: false,
			__INTLIFY_PROD_DEVTOOLS__: false,
			__APP_ENV__: JSON.stringify(env.APP_ENV),
		},
	};
});

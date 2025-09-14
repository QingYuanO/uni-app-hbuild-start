<!-- 包裹每个页面的组件，集成一些全局功能 -->
<template>
	<wd-config-provider :theme="theme" :theme-vars="themeVars">
		<view :class="cn('cover-nutui relative mx-auto box-border bg-borurio-bg', osName, $attrs.class as string)">
			<slot name="header"></slot>
			<view :style="{ paddingTop: `${contentTop}px`, paddingBottom: `${contentBottom}px` }">
				<slot></slot>
			</view>

			<slot name="footer"></slot>
		</view>
	</wd-config-provider>
</template>

<script lang="ts">
export default {
	name: 'Container',
	options: {
		addGlobalClass: true,
		virtualHost: true,
		styleIsolation: 'shared',
		inheritAttrs: false,
	},
};
</script>

<script setup lang="ts">
defineOptions({
	name: 'container',
	options: {
		virtualHost: true,
		addGlobalClass: true,
		styleIsolation: 'shared',
	},
})

const props = withDefaults(
	defineProps<{
		/**
		 * 是否需要登录
		 */
		needAuth?: boolean;
		customClass?: string;
		hasStatusBarTop?: boolean;
		footerClass?: string;
	}>(),
	{
		hasStatusBarTop: true,
	}
);

const { osName } = useSystemOs();

const { theme, themeVars } = useTheme({
	// buttonPrimaryBgColor: '#07c160',
	// buttonPrimaryColor: '#07c160'
})

const slots = useSlots();

const { safeArea } = uni.getWindowInfo();

const instance = getCurrentInstance();

const footerHeader = ref(0);

const contentTop = computed(() => {
	return (slots.header ? 44 : 0) + (props.hasStatusBarTop ? safeArea.top : 0);
});

const contentBottom = computed(() => {
	return slots.footer ? footerHeader.value : 0;
});

onMounted(() => {
	getFooterHeight();
});

onLoad(() => { });

onShow(() => {
	// const token = uni.getStorageSync('token');

	// if (props.needAuth && !token) {
	// 	uni.removeStorageSync('userData');
	// 	uni.redirectTo({
	// 		url: '/pages/login/index',
	// 	});

	// 	return;
	// }
});

const getFooterHeight = () => {
	const query = uni.createSelectorQuery().in(instance?.proxy);
	query
		.select('#fixed_footer')
		.boundingClientRect((data: any) => {
			footerHeader.value = data?.height ?? 0;
		})
		.exec();
};

defineExpose({
	getFooterHeight,
});
</script>

import { computed, getCurrentInstance, nextTick, ref } from 'vue';

import i18n from '@/i18n';
import { isArray, isEmpty, isNumber } from 'lodash-es';

import { COLOR } from './constant';

const { t } = i18n.global;

// 获取父组件
export function getParent(name: string, k1: string[], k2?: string[]) {
	const { proxy }: any = getCurrentInstance();

	const d = ref();
	let n = 10;

	const next = () => {
		let parent = proxy.$parent;

		while (parent) {
			if (parent.$options.name !== name) {
				parent = parent.$parent;
			} else {
				if (isArray(k2)) {
					nextTick(() => {
						const child: any = {};

						(k2 || []).map((key: string) => {
							if (proxy[key]) {
								child[key] = proxy[key];
							}
						});

						if (!parent.__children) {
							parent.__children = [];
						}

						if (!isEmpty(child)) {
							parent.__children.push(child);
						}
					});
				}

				return (k1 || []).reduce((res: any, key: string) => {
					res[key] = parent[key];

					return res;
				}, {});
			}
		}

		return parent || d.value;
	};

	return computed(() => next());
}

// 获取元素位置信息
export async function getRect(selector: string): Promise<UniApp.NodeInfo | UniApp.NodeInfo[]> {
	return new Promise((resolve) => {
		uni
			.createSelectorQuery()
			.select(selector)
			.boundingClientRect((res) => {
				resolve(res);
			})
			.exec();
	});
}

export const setStatusBarColor = (type: 'light' | 'dark') => {
	uni.setNavigationBarColor({
		frontColor: type === 'light' ? '#ffffff' : '#000000',
		backgroundColor: COLOR.bg,
	});
};

// 获取自定义navbar高度
export const getCustomNavHeight = () => {
	let headerHeight = 44;

	// #ifdef MP-WEIXIN
	const menuButtonBounding = uni.getMenuButtonBoundingClientRect();
	headerHeight = menuButtonBounding.top + menuButtonBounding.height + 5;
	// #endif

	// #ifdef APP-PLUS
	const statusBarHeight = uni.getWindowInfo().statusBarHeight;
	headerHeight = 44 + (statusBarHeight ?? 0);
	// #endif

	return headerHeight;
};

export const getSafeArea = () => {
	const windowInfo = uni.getWindowInfo();
	const safeBottom = windowInfo.screenHeight - (windowInfo?.safeArea?.bottom ?? 0);
	const safeTop = windowInfo.safeArea?.top;
	const safeHeight = windowInfo.safeArea?.height;
	return {
		safeBottom,
		safeTop,
		safeHeight,
	};
};

/**
 * 获取常规Model 参数
 * @returns
 */
export const getModelOption = () => {
	return {
		cancelText: t('message.All.Cancel'),
		confirmText: t('message.All.Confirm'),
		confirmColor: COLOR.primary,
	} as UniNamespace.ShowModalOptions;
};

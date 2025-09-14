import i18n from '@/i18n';
import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { COLOR } from './constant';

const { t } = i18n.global;

/**
 * 获取小程序路由EventChannel
 * @returns UniApp.EventChannel
 */
export const getOpenerEventChannel = () => {
	const instance = getCurrentInstance()?.proxy;
	//@ts-ignore
	const eventChannel: UniApp.NavigateToSuccessOptions['eventChannel'] = instance?.getOpenerEventChannel?.();

	return eventChannel;
};

/**
 * 换算单位
 * @param num 数值
 * @returns 根据尺寸转换后的值
 */
export const pt = (num: number) => {
	const { screenWidth } = uni.getWindowInfo();
	return num * (screenWidth / 375);
};
export const getCurrentPage = () => {
	const pages = getCurrentPages();
	const currentPage = pages[pages.length - 1];
	return currentPage;
};

/**
 * 将多个类值组合成一个字符串。
 *
 * @param inputs - 要组合的类值。
 * @returns 组合后的类字符串。
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const setStatusBarColor = (type: 'light' | 'dark') => {
	uni.setNavigationBarColor({
		frontColor: type === 'light' ? '#ffffff' : '#000000',
		backgroundColor: COLOR.bg,
	});
};

// 获取自定义navbar高度
export const getCustomNavHeight = () => {
	const statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
	return 44 + (statusBarHeight ?? 0);
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

/**
 * 复制内容
 * @param val
 */
export const copyText = (val: string) => {
	uni.setClipboardData({
		data: val,
		success: function () {
			uni.showToast({
				title: t('message.Tip.Copy_Success'),
				icon: 'none',
				duration: 2000,
			});
		},
	});
};

/**
 * 跳转到平台对应的应用商店
 */
export const jumpToAppMarket = () => {
	const googlePlay = 'com.android.vending';

	const androidPackName = 'com.zjwl.benben';
	if (plus.os.name == 'Android') {
		const Uri = plus.android.importClass('android.net.Uri') as any;
		const Intent = plus.android.importClass('android.content.Intent') as any;
		const main = plus.android.runtimeMainActivity() as any;

		const uri = Uri.parse('market://details?id=' + androidPackName);
		const intent = new Intent(Intent.ACTION_VIEW, uri);
		// 选择进入商店
		intent.setPackage(googlePlay);
		intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK;
		// 没有该商店应用
		if (intent.resolveActivity(main.getPackageManager()) !== null) {
			main.startActivity(intent);
		} else {
			// 跳转浏览器
			let uri = Uri.parse('https://play.google.com/store/apps/details?id=' + androidPackName);
			let intent = new Intent(Intent.ACTION_VIEW, uri);
			intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK;
			intent.setPackage('com.android.browser');
			main.startActivity(intent);
		}
	} else {
		plus.runtime.openURL('itms-apps://itunes.apple.com/cn/app/id6612015886?mt=8');
	}
};

// 请求通知权限
export const requestNotificationPermission = () => {
	if (plus.os.name !== 'Android') {
		return;
	}

	const permissionName = 'android.permission.POST_NOTIFICATIONS';
	const { notificationAuthorized } = uni.getAppAuthorizeSetting();

	if (notificationAuthorized === 'authorized') return;

	plus.android.requestPermissions([permissionName], function (e) {
		if (e.deniedPresent.length > 0) {
			// 权限被拒绝
		}
	});
};

export const toJumpLinks = (url: string) => {
	if (!url) return;

	// #ifdef H5
	window.open(url, '_blank');
	// #endif

	// #ifdef APP-PLUS
	plus.runtime.openURL(url);

	// #endif
};

export const toWhatsApp = () => {
	toJumpLinks('https://wa.me/+996770570579');
};

import i18n from '@/i18n';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

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

// uuid
export function uuid(): string {
	const s: any[] = [];
	const hexDigits = '0123456789abcdef';
	for (let i = 0; i < 36; i++) {
		s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	}
	s[14] = '4';
	s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
	s[8] = s[13] = s[18] = s[23] = '-';

	return s.join('');
}

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

export const toJumpLinks = (url: string) => {
	if (!url) return;

	// #ifdef H5
	window.open(url, '_blank');
	// #endif

	// #ifdef APP-PLUS
	plus.runtime.openURL(url);

	// #endif
};

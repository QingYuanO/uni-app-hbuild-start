/**
 * 组织退出应用，直接退回到后台
 */
export default function useAndroidMoveTaskToBack() {
	onBackPress(() => {

	const deviceInfo = 	uni.getDeviceInfo()

	if(deviceInfo.platform === 'android') {
		let main = plus.android.runtimeMainActivity();
		plus.runtime.quit = function () {
			//@ts-ignore
			main?.moveTaskToBack(false);
		};
	}

		// uni.getDeviceInfo({
		// 	success(res) {

				
				
				
		// 		if (res.osName == 'android') {
					
		// 		}
		// 	},
		// })
	});
}

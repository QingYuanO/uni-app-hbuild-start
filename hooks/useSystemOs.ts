export default function useSystemOs() {
	const osName = ref<'ios' | 'android' | 'windows' | 'mac' | 'linux'>();

	const isIos = computed(() => osName.value === 'ios');
	const isAndroid = computed(() => osName.value === 'android');

	onLoad(() => {

		const deviceInfo = 	uni.getDeviceInfo()

		osName.value = deviceInfo.platform as any;

		
	});

	return { osName, isAndroid, isIos };
}

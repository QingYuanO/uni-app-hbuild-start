<!-- 首页 -->
<template>
	<Container>
		<template #header>
			<wd-navbar fixed safeAreaInsetTop title="首页"></wd-navbar>
		</template>

		<view style="width: 100rpx; height: 100rpx; background-color: red" :style="{ transform: `translateX(${translateX}px)` }"></view>
		<wd-button @click="handleAnimation">动画</wd-button>
		<!-- <wd-cell-group border>
			<wd-cell v-for="item in data" :key="item" :title="item" />
		</wd-cell-group> -->
	</Container>
</template>

<script setup lang="ts">
import { animate } from 'popmotion';

const data = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

const translateX = ref(0);

onMounted(() => {});

const handleAnimation = () => {
	const controls = animate({
		type: 'spring',
		from: 0,
		to: 100,
		duration: 300,
		mass: 1,
		velocity: 20,

		onUpdate: (v) => {
			translateX.value = v;
			// if (v > 20) controls.stop();
		},
	});
};
</script>

<style lang="scss" scoped></style>

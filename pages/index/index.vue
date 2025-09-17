<!-- 首页 -->
<template>
	<Container>
		<template #header>
			<wd-navbar fixed safeAreaInsetTop title="首页"></wd-navbar>
		</template>
		<wd-cell-group border>
			<wd-cell v-for="item in data" :key="item" :title="item" />
		</wd-cell-group>
	</Container>
</template>

<script setup lang="ts">
const data = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
onMounted(() => {});
</script>

<style lang="scss" scoped></style>

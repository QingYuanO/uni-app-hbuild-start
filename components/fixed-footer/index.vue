<template>
	<view :id="props.id" :class="cn('fixed inset-x-0 bottom-0 z-[300] box-border flex px-4', $attrs.class as string, isShowHomeIndicator && 'ios:pb-5')">
		<slot />
	</view>
</template>

<script lang="ts">
export default {
	name: 'FixedFooter',
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
	inheritAttrs: false,
});

const props = withDefaults(
	defineProps<{
		id?: string;
	}>(),
	{
		id: 'fixed_footer',
	}
);

const isShowHomeIndicator = uni.getWindowInfo().safeAreaInsets?.bottom ?? 0 > 0;
</script>
<style scoped></style>

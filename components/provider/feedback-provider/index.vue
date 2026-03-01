<script setup lang="ts">
defineOptions({
  name: "FeedbackProvider",
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: "shared",
  },
});

const props = withDefaults(
  defineProps<{
    customClass?: string;
    customStyle?: string;
  }>(),
  {
    customClass: "",
    customStyle: "",
  },
);

onLoad(() => {

});

defineExpose({

});
</script>

<template>
  <view :class="cn('', customClass)" :style="customStyle">
    <slot />
    <global-toast />
    <global-message />
  </view>
</template>

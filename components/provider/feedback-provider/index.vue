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

const toast = useToast("global-toast");
const messageBox = useMessage("global-message-box");

onLoad(() => {

});

defineExpose({
  toast: () => toast,
  messageBox: () => messageBox,
});
</script>

<template>
  <view :class="cn('', customClass)" :style="customStyle">
    <slot />
    <wd-toast selector="global-toast" custom-class=" w-[65vw]! bg-white! px-4! py-1.5! text-foreground!" />
    <wd-message-box selector="global-message-box" custom-class="global-message-box" />
  </view>
</template>

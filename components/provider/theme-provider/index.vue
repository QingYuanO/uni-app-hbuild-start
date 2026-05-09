<script setup lang="ts">
defineOptions({
  name: "ThemeProvider",
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
    customStyle: "",
  },
);

const themeStore = useThemeStore();

onShow(() => {});
</script>

<template>
  <view
    :class="cn(DEVICE_INFO.osName, themeStore.theme, 'cover-wd', customClass)"
    :style="`${customStyle}--custom-navbar-height:${getCustomNavHeight()}px;`"
  >
    <slot />
  </view>
</template>

    <style lang="scss" scoped>

    </style>

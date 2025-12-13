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

const { osName } = useSystemOs();

const themeStore = useThemeStore();

onShow(() => {});
</script>

<template>
  <wd-config-provider
    :theme="themeStore.theme" :theme-vars="themeStore.themeVars" :custom-class="cn(osName, themeStore.theme, 'cover-wd', customClass)"
    :custom-style="`${customStyle}--custom-navbar-height:${getCustomNavHeight()}px;`"
  >
    <slot />
  </wd-config-provider>
</template>

    <style lang="scss" scoped>

    </style>

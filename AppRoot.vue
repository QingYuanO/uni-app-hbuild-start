<script setup lang="ts">


const { theme, themeVars } = useTheme({
  // buttonPrimaryBgColor: '#07c160',
  // buttonPrimaryColor: '#07c160'
})
</script>

<template>
  <wd-config-provider :theme="theme" :theme-vars="themeVars">
    <KuRootView />
  </wd-config-provider>
</template>

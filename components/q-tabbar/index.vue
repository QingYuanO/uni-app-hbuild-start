<script setup lang="ts">
import { router } from "@/router";

defineOptions({
  name: "QTabbar",
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: "shared",
  },
});

const { activeTabbar, getTabbarItemValue, setTabbarItemActive, tabbarList } = useTabbar();

function handleTabbarChange({ value }: { value: string }) {
  setTabbarItemActive(value);
  router.switchTab(value);
}

onMounted(() => {
  // #ifdef APP
  uni.hideTabBar();
  // #endif
  nextTick(() => {
    if (router.path && router.path !== `/${activeTabbar.value.path}`) {
      setTabbarItemActive(router.path);
    }
  });
});
</script>

<template>
  <wd-tabbar
    :model-value="activeTabbar.path" fixed
    safe-area-inset-bottom placeholder
    custom-class="h-15!"
    bordered
    @change="handleTabbarChange"
  >
    <wd-tabbar-item
      v-for="value in tabbarList"
      :key="value.path"
      :name="value.path"
      :title="value.title"
      :icon="value.icon"
      custom-class=""
      :value="getTabbarItemValue(value.path)"
    >
      <!-- <template #icon>
        <image :class="cn('mb-1')" :src="tabbarStore.activeTabbar === `/${value.pagePath}` ? value.selectedIconPath : value.iconPath" class="size-5 " />
      </template> -->
    </wd-tabbar-item>
  </wd-tabbar>
</template>

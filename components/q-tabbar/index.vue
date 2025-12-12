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

const tabbarStore = useTabbarStore();

function handleTabbarChange({ value }: { value: string }) {
  router.push({
    path: `/${value}`,
    mode: "switchTab",
    success: () => {
      tabbarStore.setActiveTabbar(value);
    },

  });
}
</script>

<template>
  <wd-tabbar
    :model-value="tabbarStore.activeTabbar" fixed
    safe-area-inset-bottom placeholder
    custom-class="shadow-tabbar! h-15!"
    bordered
    @change="handleTabbarChange"
  >
    <wd-tabbar-item
      v-for="value in tabbarStore.tabbarList"
      :key="value.pagePath"
      :name="value.pagePath"
      :title="value.text"
      :icon="value.iconPath"
      custom-class=""
      :value="value.value"
    >
      <!-- <template #icon>
        <image :class="cn('mb-1')" :src="tabbarStore.activeTabbar === `/${value.pagePath}` ? value.selectedIconPath : value.iconPath" class="size-5 " />
      </template> -->
    </wd-tabbar-item>
  </wd-tabbar>
</template>

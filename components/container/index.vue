<!-- 包裹每个页面的组件，集成一些全局功能 -->

<script setup lang="ts">
import { router } from "@/router";

defineOptions({
  name: "Container",
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: "shared",
  },
});

const props = withDefaults(
  defineProps<{
    /**
     * 是否需要登录
     */
    needAuth?: boolean;
    customClass?: string;
    footerClass?: string;
  }>(),
  {},
);

const { osName } = useSystemOs();

const themeStore = useThemeStore();

const user = useUserStore();

const slots = useSlots();

const instance = getCurrentInstance();

const footerHeader = ref(0);

const contentTop = computed(() => {
  return slots.header ? getCustomNavHeight() : 0;
});

const contentBottom = computed(() => {
  return slots.footer ? footerHeader.value : 0;
});

onMounted(() => {
  if (slots.footer) {
    getFooterHeight();
  }
});

onLoad(() => {
  console.log(router.currentPage());

  // if (!user.token) {
  //   router.login({ reLaunch: true });
  // }
});

onShow(() => {});

function getFooterHeight() {
  const query = uni.createSelectorQuery().in(instance?.proxy);
  query
    .select("#container_footer")
    .boundingClientRect((data: any) => {
      footerHeader.value = data?.height ?? 0;
    })
    .exec();
}

defineExpose({
  getFooterHeight,
});
</script>

<template>
  <wd-config-provider :theme="themeStore.theme" :custom-class="themeStore.theme">
    <view :class="cn('relative box-border min-h-screen  bg-background text-foreground', osName, $attrs.class as string)">
      <slot name="header" />
      <view :style="{ paddingTop: `${contentTop}px`, paddingBottom: `${contentBottom}px` }">
        <slot />
      </view>
      <view id="container_footer" :class="cn('fixed inset-x-0 bottom-0 z-300 box-border', props.footerClass)">
        <slot name="footer" />
      </view>
    </view>

    <wd-toast />
    <wd-message-box />
  </wd-config-provider>
</template>

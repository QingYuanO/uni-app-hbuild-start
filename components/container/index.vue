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
    title?: string;
    isTabbar?: boolean;
    linearGradientHeight?: number;
    hasBack?: boolean;
    linearGradientFrom?: string;
    linearGradientTo?: string;
    navbarClass?: string;
  }>(),
  {
    needAuth: true,
    title: "",
    isTabbar: false,
    linearGradientHeight: 200,
    hasBack: false,
    linearGradientFrom: "#E8E6FC",
    linearGradientTo: "#e8e6fc07",
    navbarClass: "",
  },
);

const slots = useSlots();

const instance = getCurrentInstance();

const footerHeader = ref(0);

const contentTop = computed(() => {
  return slots.header ? getCustomNavHeight() : 0;
});

const contentBottom = computed(() => {
  return slots.footer ? footerHeader.value : 0;
});
const defaultNavbarClass = "after:pointer-events-none after:absolute after:inset-x-0 after:top-0 after:z-0 after:h-(--linear-gradient-height) after:bg-linear-to-b after:from-(--linear-gradient-from) after:to-(--linear-gradient-to) after:content-[\"\"] after:select-none";
const customStyleCssVar = computed(() => {
  return `
        --linear-gradient-from: ${props.linearGradientFrom};
        --linear-gradient-to: ${props.linearGradientTo};
        --linear-gradient-height: ${props.linearGradientHeight * 2}rpx;
      `;
});

onMounted(() => {
  // #ifdef APP
  if (router.isCustomTabbar && props.isTabbar) {
    uni.hideTabBar();
  }
  // #endif
  if (slots.footer) {
    getFooterHeight();
  }
});

onLoad(() => {

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

function handleBack() {
  router.back();
}

defineExpose({
  getFooterHeight,
});
</script>

<template>
  <auth-provider :need-auth="needAuth">
    <theme-provider
      :custom-style="customStyleCssVar"
    >
      <view :class="cn('relative box-border bg-background text-foreground')">
        <view class=" pointer-events-none fixed inset-x-0 top-0 z-0 h-(--linear-gradient-height) bg-linear-to-b from-(--linear-gradient-from) to-(--linear-gradient-to) select-none" />
        <wd-navbar
          :custom-class="cn('relative overflow-hidden', linearGradientHeight > 0 && defaultNavbarClass, navbarClass) " fixed
          safe-area-inset-top
          placeholder :bordered="false"
          :title="title"
        >
          <template #left>
            <slot name="navbar-left">
              <wd-icon
                v-if="hasBack" name="arrow-left" custom-class="wd-navbar__arrow"
                @click="handleBack"
              />
            </slot>
          </template>
          <template #right>
            <slot name="navbar-right" />
          </template>
        </wd-navbar>
        <view :style="{ paddingBottom: `${contentBottom}px` }" :class="cn('relative z-1', props.customClass)">
          <slot />
        </view>
        <view id="container_footer" :class="cn('fixed inset-x-0 z-300 box-border ', props.isTabbar ? 'bottom-15' : 'bottom-safe bottom-0 ', props.footerClass)">
          <slot name="footer" />
        </view>
        <QTabbar v-if="props.isTabbar" />
      </view>

      <wd-toast selector="global-toast" custom-class=" w-[65vw]! bg-white! px-4! py-1.5! text-foreground!" />
      <wd-message-box selector="global-message-box" />
    </theme-provider>
  </auth-provider>
</template>

  <style lang="scss" scoped>
  :deep(.wd-navbar__content){
    position: relative;
    z-index: 1;

  }
  </style>

<!-- 包裹每个页面的组件，集成一些全局功能 -->

<script setup lang="ts">
import type FeedbackProvider from "@/components/provider/feedback-provider/index.vue";
import type { ZPagingProps } from "@/uni_modules/z-paging/types/comps/z-paging";
import { router } from "@/router";
import empty from "@/static/images/empty.png";

defineOptions({
  name: "ContainerZPaging",
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
    title?: string;
    isTabbar?: boolean;
    linearGradientHeight?: number;
    hasBack?: boolean;
    zPagingProps?: Omit<ZPagingProps, "onQuery" | "layoutOnly">;
    layoutOnly?: boolean;
    modelValue?: any[];
    hideNavbar?: boolean;
    linearGradientFrom?: string;
    linearGradientTo?: string;
    navbarClass?: string;
    navbarBordered?: boolean;
    /**
     * 在不显示 tabbar 的时候，是否显示 statusBar 占位高度元素
     */
    statusBarPlaceholder?: boolean;
  }>(),
  {
    needAuth: true,
    title: "",
    isTabbar: false,
    linearGradientHeight: 0,
    linearGradientFrom: "#E8E6FC",
    linearGradientTo: "#e8e6fc07",
    hasBack: false,
    layoutOnly: true,
    hideNavbar: false,
    navbarBordered: true,
    statusBarPlaceholder: true,
    zPagingProps: () => ({
    }),
  },
);

const emit = defineEmits<{
  (e: "update:modelValue", value: any[]): void;
  (e: "query", pageNo: number, pageSize: number, from: ZPagingEnums.QueryFrom): void;
  (e: "scroll", data: ZPagingParams.ScrollInfo | ZPagingParams.ScrollInfoN): void;

}>();

const slots = defineSlots<{
  "top"?: () => any;
  "bottom"?: () => any;
  "navbar-left"?: () => any;
  "navbar-right"?: () => any;
  "default"?: () => any;
  "feedback"?: () => any;
}>();

const paging = ref<ZPagingRef>();
const customStyleCssVar = computed(() => {
  return `
      --linear-gradient-from: ${props.linearGradientFrom};
      --linear-gradient-to: ${props.linearGradientTo};
      --linear-gradient-height: ${props.linearGradientHeight * 2}rpx;
    `;
});

const defaultNavbarClass = "after:pointer-events-none after:absolute after:inset-x-0 after:top-0 after:z-0 after:h-(--linear-gradient-height) after:bg-linear-to-b after:from-(--linear-gradient-from) after:to-(--linear-gradient-to) after:content-[\"\"] after:select-none";

onMounted(() => {
  // #ifdef APP
  if (router.isCustomTabbar && props.isTabbar) {
    uni.hideTabBar();
  }
  // #endif
});

onLoad(() => {

});

onShow(() => {});

function handleQuery(pageNo: number, pageSize: number, from: ZPagingEnums.QueryFrom) {
  emit("query", pageNo, pageSize, from);
}

function handleScroll(e: ZPagingParams.ScrollInfo | ZPagingParams.ScrollInfoN) {
  emit("scroll", e);
}

function handleBack() {
  router.back();
}

defineExpose({
  getPagingRef: () => paging.value,

});
</script>

<template>
  <auth-provider :need-auth="needAuth">
    <theme-provider
      :custom-style="customStyleCssVar"
    >
      <feedback-provider>
        <z-paging
          ref="paging" v-bind="zPagingProps" :paging-class="cn(zPagingProps.pagingClass, 'relative box-border bg-background text-foreground')"
          :layout-only="props.layoutOnly"
          :value="props.modelValue"
          :safe-area-inset-bottom="!props.isTabbar"
          @list-change="emit('update:modelValue', $event)"
          @query="handleQuery" @scroll="handleScroll"
        >
          <template #top>
            <view v-if="linearGradientHeight > 0" class=" pointer-events-none fixed inset-x-0 top-0 z-0 h-(--linear-gradient-height) bg-linear-to-b from-(--linear-gradient-from) to-(--linear-gradient-to) select-none" />
            <view v-if="props.hideNavbar && props.statusBarPlaceholder" class="status-bar-height" />
            <view class="relative z-1">
              <wd-navbar
                v-if="!props.hideNavbar"
                :custom-class="cn('relative overflow-hidden', linearGradientHeight > 0 && defaultNavbarClass, navbarClass) "
                safe-area-inset-top
                :bordered="navbarBordered"
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
              <slot name="top" />
            </view>
          </template>
          <view :class="cn(props.customClass, 'relative z-1')">
            <slot />
          </view>
          <template #bottom>
            <QTabbar v-if="props.isTabbar" />
            <slot name="bottom" />
          </template>

          <template #empty>
            <view class=" flex-col-center">
              <image :src="empty" class="size-36" />
              <view class="mt-5 text-sm text-[#a4a4a4]">
                暂无数据
              </view>
            </view>
          </template>
          <template #loading>
            <view class="flex h-full flex-col items-center justify-center">
              <wd-loading :size="20" type="spinner" />
              <view class="mt-5 text-sm text-[#a4a4a4]">
                加载中...
              </view>
            </view>
          </template>
        </z-paging>
        <slot name="feedback" />
      </feedback-provider>
    </theme-provider>
  </auth-provider>
</template>

<style lang="scss" scoped>
:deep(.wd-navbar__content){
  position: relative;
  z-index: 1;

}
</style>

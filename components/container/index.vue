<!-- 包裹每个页面的组件，集成一些全局功能 -->
<script lang="ts">
export default {
  name: "Container",
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: "shared",
    inheritAttrs: false,
  },
};
</script>

<script setup lang="ts">
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

const slots = useSlots();

const instance = getCurrentInstance();

const footerHeader = ref(0);

const contentTop = computed(() => {
  return slots.header ? getCustomNavHeight() : 0;
});

const contentBottom = computed(() => {
  return slots.footer ? footerHeader.value : 0;
});

const pageMetaBgColor = computed(() => {
  return themeStore.theme === "dark" ? "#0a0a0a" : "#ffffff";
});

watch(() => themeStore.theme, (newVal) => {
  uni.setBackgroundColor({
    backgroundColor: pageMetaBgColor.value,
    backgroundColorTop: pageMetaBgColor.value,
    backgroundColorBottom: pageMetaBgColor.value,
    success(result) {
      console.log(result);
    },
  });
  uni.setBackgroundTextStyle({
    textStyle: newVal === "dark" ? "light" : "dark",
  });
});

onMounted(() => {
  if (slots.footer) {
    getFooterHeight();
  }
});

onLoad(() => {});

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
  <wd-config-provider :theme="themeStore.theme">
    <view :class="cn('relative box-border min-h-screen  bg-background text-foreground', themeStore.theme, osName, $attrs.class as string)">
      <slot name="header" />
      <view :style="{ paddingTop: `${contentTop}px`, paddingBottom: `${contentBottom}px` }">
        <slot />
      </view>
      <view id="container_footer" :class="cn('fixed inset-x-0 bottom-0 z-[300] box-border', props.footerClass)">
        <slot name="footer" />
      </view>
    </view>
  </wd-config-provider>
</template>

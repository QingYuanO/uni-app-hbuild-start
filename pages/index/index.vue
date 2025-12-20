<!-- 首页 -->
<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { animate } from "popmotion";
import { getSingleImg } from "@/service/api/image";
import { useThemeStore } from "@/store/theme";
import Feedback from "./components/feedback.vue";

const themeStore = useThemeStore();

const translateX = ref(0);

const { data } = useQuery({
  queryKey: ["getSingleImg"],
  queryFn: getSingleImg,
});

onLoad(() => {

});

function handleAnimation() {
  const controls = animate({
    type: "spring",
    from: 0,
    to: 100,
    duration: 300,
    mass: 1,
    velocity: 20,

    onUpdate: (v) => {
      translateX.value = v;
      // if (v > 20) controls.stop();
    },
  });
}
</script>

<template>
  <container-paging title="首页" is-tabbar custom-class="py-1.5">
    <view class="flex flex-col gap-y-4 px-4">
      <view>
        <view class="size-25 bg-primary " :style="{ transform: `translateX(${translateX}px)` }" />

        <wd-button @click="handleAnimation">
          动画
        </wd-button>
      </view>

      <wd-button type="primary" custom-class=" w-20! rounded-lg! bg-amber-300!">
        Custom Button
      </wd-button>
      <feedback />

      <view class="fixed right-4 bottom-40 flex-center size-12 rounded-full bg-foreground text-background opacity-90 shadow" @click="themeStore.setTheme(themeStore.theme === 'light' ? 'dark' : 'light')">
        <view v-if="themeStore.theme === 'light'" class="icon-[akar-icons--moon] text-lg" />
        <view v-else class="icon-[akar-icons--sun] text-lg" />
      </view>
    </view>
  </container-paging>
</template>

<style lang="scss" scoped></style>

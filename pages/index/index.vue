<!-- 首页 -->
<script setup lang="ts">
import { animate } from "popmotion";
import { getSingleImg } from "@/service/api/image";
import { useThemeStore } from "@/store/theme";

const themeStore = useThemeStore();

const data = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

const translateX = ref(0);

onLoad(() => {
  getSingleImg();
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
  <Container>
    <template #header>
      <wd-navbar fixed safe-area-inset-top title="首页" />
    </template>

    <view
      style="width: 100rpx; height: 100rpx; background-color: red"
      :style="{ transform: `translateX(${translateX}px)` }"
    />
    <wd-button @click="handleAnimation">
      动画
    </wd-button>
    <wd-button @click="themeStore.setTheme('dark')">
      暗色模式
    </wd-button>

    <wd-button @click="themeStore.setTheme('light')">
      亮色模式
    </wd-button>
  </Container>
</template>

<style lang="scss" scoped></style>

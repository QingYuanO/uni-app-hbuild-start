<!-- 首页 -->
<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { animate } from "popmotion";
import { getSingleImg } from "@/service/api/image";
import { useThemeStore } from "@/store/theme";

const themeStore = useThemeStore();

const toast = useToast();
const message = useMessage();

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

function handleToast() {
  toast.show("提示信息");
}
function handleMessage() {
  message.alert("操作成功");
}
</script>

<template>
  <Container>
    <template #header>
      <wd-navbar fixed safe-area-inset-top title="首页" />
    </template>

    <view class="flex flex-col gap-y-4">
      <view>
        <view class="size-25 bg-primary " :style="{ transform: `translateX(${translateX}px)` }" />

        <wd-button @click="handleAnimation">
          动画
        </wd-button>
      </view>
      <wd-button @click="themeStore.setTheme('dark')">
        暗色模式
      </wd-button>

      <wd-button @click="themeStore.setTheme('light')">
        亮色模式
      </wd-button>
      <wd-button @click="handleToast">
        Toast
      </wd-button>
      <wd-button @click="handleMessage">
        Message
      </wd-button>
    </view>
  </Container>
</template>

<style lang="scss" scoped></style>

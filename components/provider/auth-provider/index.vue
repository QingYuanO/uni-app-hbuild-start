<script setup lang="ts">
import { router } from "@/router";

defineOptions({
  name: "AuthProvider",
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

  }>(),
  {
    needAuth: true,
  },
);

const user = useUserStore();

onLoad(() => {
  if (props.needAuth && !user.token) {
    router.login({ reLaunch: true });
  }
});
</script>

<template>
  <slot />
</template>

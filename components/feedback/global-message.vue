<script lang="ts" setup>
import { deepClone, isFunction } from "wot-design-uni/components/common/util";

import { router } from "@/router";

const { messageOptions, currentPage } = storeToRefs(useGlobalMessage());

const messageBox = useMessage("globalMessage");
const currentPath = router.path;

// #ifdef MP-ALIPAY
const hackAlipayVisible = ref(false);

nextTick(() => {
  hackAlipayVisible.value = true;
});
// #endif

watch(() => messageOptions.value, (newVal) => {
  if (newVal) {
    if (currentPage.value === currentPath) {
      const option = deepClone(newVal);
      messageBox.show(option).then((res) => {
        if (option.success && isFunction(option.success)) {
          option.success(res);
        }
      }).catch((err) => {
        if (option.fail && isFunction(option.fail)) {
          option.fail(err);
        }
      });
    }
  }
  else {
    messageBox.close();
  }
});
</script>

<script lang="ts">
export default {
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: "shared",
  },
};
</script>

<template>
  <!-- #ifdef MP-ALIPAY -->
  <wd-message-box v-if="hackAlipayVisible" selector="globalMessage" custom-class="global-message-box" />
  <!-- #endif -->
  <!-- #ifndef MP-ALIPAY -->
  <wd-message-box selector="globalMessage" custom-class="global-message-box" />
  <!-- #endif -->
</template>

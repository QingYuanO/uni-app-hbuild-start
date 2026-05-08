<script setup lang="ts">
const toast = useGlobalToast();
const dialog = useGlobalDialog();

function handleToast() {
  toast.success("成功");
}

function handleMessageBox() {
  dialog.alert("提示");
}
</script>

<template>
  <view class="flex gap-4">
    <wd-button type="primary" @click="handleToast">
      toast
    </wd-button>
    <wd-button type="primary" @click="handleMessageBox">
      messageBox
    </wd-button>
  </view>
</template>

<style scoped>

</style>

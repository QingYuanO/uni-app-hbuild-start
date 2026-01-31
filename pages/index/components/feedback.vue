<script setup lang="ts">
const toast = useGlobalToast()
const messageBox = useGlobalMessage()

function handleToast() {


  toast.success("成功");
}

function handleMessageBox() {
  messageBox.alert("提示");
}
</script>

<template>
  <view class="flex gap-y-4">
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

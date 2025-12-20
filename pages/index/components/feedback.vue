<script setup lang="ts">
const feedback = useFeedback();

function handleToast() {
  console.log(feedback.toast);

  feedback.toast.success("成功");
}

function handleMessageBox() {
  feedback.messageBox.alert("提示");
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

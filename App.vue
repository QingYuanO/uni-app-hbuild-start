<script setup lang="ts">
import { focusManager, onlineManager } from "@tanstack/vue-query";

onLoad(() => {
  uni.onNetworkStatusChange(onlineChange);
});
onUnload(() => {
  uni.offNetworkStatusChange(onlineChange);
});
onShow(() => {
  focusManager.setFocused(true);
});
onHide(() => {
  focusManager.setFocused(false);
});
function onlineChange(res: UniApp.OnNetworkStatusChangeSuccess) {
  if (onlineManager.isOnline() === res.isConnected)
    return;
  onlineManager.setOnline(res.isConnected);
}

function stepMessagePush() {
  const client = uni.getSystemInfoSync().platform;

  plus.push.addEventListener(
    "receive",
    (msg: any) => {
      console.log(msg);
      const { body, title, type } = msg.payload ?? {};
      if (client === "ios") {
        if (msg.aps) {
          // Apple APNS message
          // APNS下发的消息，应用在前台
        }
        else if (type === "LocalMSG") {
          // 特殊payload标识本地创建的消息
          // 本地创建的消息，通常不需要处理
          // 注意：不要在这种情况下再此调用plus.push.createMessage，从而引起循环创建本地消息
        }
        else {
          plus.push.createMessage(body, { ...(msg.payload ?? {}), type: "LocalMSG" }, { title });
        }
      }
      if (client === "android") {
        // 如果是Android，当APP在线时，收到透传消息不会进入系统消息，需要发送本地提醒。
        plus.push.createMessage(body, { ...(msg.payload ?? {}), type: "LocalMSG" }, { title });
        // plus.runtime.setBadgeNumber(1);
      }
    },
    false,
  );

  plus.push.addEventListener(
    "click",
    (msg: any) => {
      const { url } = msg.payload ?? {};
      if (client === "ios") {
        // 如果是IOS
        if (url) {
          uni.navigateTo({
            url,
          });
        }
      }
      if (client === "android") {
        uni.navigateTo({
          url,
        });
      }
    },
    false,
  );
}
</script>

<style lang="scss">
@import './styles/tailwind.css';

@import './styles/theme.css';
</style>

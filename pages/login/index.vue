<!-- 登录 -->
<script setup lang="ts">
import type { ErrorMessage, FormExpose } from "wot-design-uni/components/wd-form/types";
import { router } from "@/router";

const user = useUserStore();

const form = ref<FormExpose>();
const formData = ref({
  phone: "",
  password: "",
});

const fromError = ref<ErrorMessage[]>([]);

const errorMap = computed(() => {
  return fromError.value.reduce((acc, curr) => {
    acc[curr.prop] = curr.message;
    return acc;
  }, {} as Record<string, string>);
});

function handleLogin() {
  form.value?.validate().then((res) => {
    console.log(res);
    if (res.valid) {
      user.setToken({
        token: "test",
        expire: 1000,
        refreshToken: "test",
        refreshExpire: 1000,
      });
      router.nextLogin();
    }
    else {
      fromError.value = res.errors;
    }
  });
}
</script>

<template>
  <container-paging title="登录" :need-auth="false">
    <view class="flex flex-col gap-y-5 px-5 pt-5">
      <wd-form
        ref="form" :model="formData"
        error-type="none" custom-class="flex flex-col gap-y-5"
      >
        <view class="flex flex-col gap-y-1">
          <wd-button type="primary" custom-class=" w-20! rounded-lg! bg-amber-300!">
            Custom Button
          </wd-button>
          <wd-input
            v-model="formData.phone" prop="phone"
            marker-side="after" custom-class=" rounded-lg border border-border" label="手机号"
            required type="text" placeholder="请输入手机号"
            :rules="[{ required: true, message: '请填写手机号' }]"
          />
          <view v-if="errorMap.phone" class="text-sm text-red-500">
            {{ errorMap.phone }}
          </view>
        </view>

        <view class=" flex flex-col gap-y-3">
          <view class="flex flex-col gap-y-1">
            <wd-input
              v-model="formData.password" prop="password"
              marker-side="after" custom-class=" rounded-lg border border-border" label="密码"
              required type="safe-password" placeholder="请输入密码"
              show-password :rules="[{ required: true, message: '请填写密码' }]"
            />
            <view v-if="errorMap.password" class="text-sm text-red-500">
              {{ errorMap.password }}
            </view>
          </view>
          <view class="flex items-center justify-between">
            <wd-checkbox :model-value="true" shape="square">
              请勾选 《<text class="text-primary">
                用户协议
              </text>》
            </wd-checkbox>
            <text class="text-sm text-primary">
              忘记密码？
            </text>
          </view>
        </view>
      </wd-form>

      <wd-button
        type="primary" size="large"
        block @click="handleLogin"
      >
        登录
      </wd-button>
      <wd-button
        type="info" size="large"
        block
      >
        立即注册
      </wd-button>
    </view>
  </container-paging>
</template>

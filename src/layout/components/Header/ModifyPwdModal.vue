<template>
  <n-modal v-model:show="modalVisible" preset="dialog" title="修改密码" :mask-closable="false">
    <n-form
      ref="formRef"
      :model="formParams"
      :rules="rules"
      label-placement="left"
      label-align="right"
      label-width="auto"
      size="medium"
      require-mark-placement="right-hanging"
      style="margin: 30px 30px 0"
    >
      <n-form-item label="旧密码" path="oldPwd">
        <n-input v-model:value="formParams.oldPwd" placeholder="8-16位字母和数字的组合" />
      </n-form-item>
      <n-form-item label="新密码" path="newPwd">
        <n-input
          v-model:value="formParams.newPwd"
          type="password"
          placeholder="8-16位字母和数字的组合"
        />
      </n-form-item>
      <n-form-item label="确认密码" path="reSecret">
        <n-input v-model:value="formParams.reSecret" type="password" placeholder="请再次输入密码" />
      </n-form-item>
    </n-form>
    <template #action>
      <n-space>
        <n-button type="info" :loading="isConfirming" @click="handleConfirmClick">确定</n-button>
        <n-button @click="modalVisible = false">取消</n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
  import { reactive, ref, defineExpose } from 'vue';
  import { useRouter } from 'vue-router';
  import { FormRules, FormItemRule, useMessage } from 'naive-ui';
  import md5 from 'md5';
  import { PWD_REGEXP } from '@/enums/validatorEnum';
  import { modifyPwd } from '@/api/user';
  import { PageEnum } from '@/enums/pageEnum';

  const LOGIN_PATH = PageEnum.BASE_LOGIN;

  const router = useRouter();
  const message = useMessage();
  const formRef = ref();

  const defaultParams = () => ({
    userName: '',
    oldPwd: '',
    newPwd: '',
    reSecret: '',
  });
  let formParams = reactive(defaultParams());

  const isConfirming = ref(false);
  const rules = reactive<FormRules>({
    oldPwd: [
      {
        required: true,
        trigger: ['blur', 'input'],
        validator(rule: FormItemRule, value: string) {
          if (rule.required) {
            if (!value) {
              return new Error('请输入密码');
            } else {
              if (!PWD_REGEXP.test(value)) {
                return new Error('密码格式错误，请输入8-16位字母和数字的组合');
              }
            }
          }

          return true;
        },
      },
    ],
    newPwd: [
      {
        required: true,
        trigger: ['blur', 'input'],
        validator(rule: FormItemRule, value: string) {
          if (rule.required) {
            if (!value) {
              return new Error('请输入密码');
            } else {
              if (!PWD_REGEXP.test(value)) {
                return new Error('密码格式错误，请输入8-16位字母和数字的组合');
              }
            }
          }

          return true;
        },
      },
    ],
    reSecret: [
      {
        required: true,
        trigger: ['blur', 'input'],
        validator(rule: FormItemRule, value: string) {
          if (rule.required) {
            if (!value) {
              return new Error('请再次输入密码');
            } else {
              if (value !== formParams.newPwd) {
                return new Error('两次输入密码不一致');
              }
            }
          }
          return true;
        },
      },
    ],
  });

  const handleConfirmClick = () => {
    formRef.value?.validate((errors) => {
      if (errors) {
        return;
      }
      isConfirming.value = true;
      const params: any = {
        oldPwd: md5(formParams.userName + md5(formParams.oldPwd)) as string,
        newPwd: md5(formParams.userName + md5(formParams.newPwd)) as string,
      };

      modifyPwd(params)
        .then(() => {
          modalVisible.value = false;
          message.success('密码修改成功，请重新登录');
          router.push(LOGIN_PATH);
        })
        .finally(() => {
          isConfirming.value = false;
        });
    });
  };

  const modalVisible = ref(false);
  const show = async (userName: string) => {
    formRef.value?.restoreValidation();
    formParams.userName = userName;
    modalVisible.value = true;
  };

  defineExpose({
    show,
  });
</script>

<style></style>

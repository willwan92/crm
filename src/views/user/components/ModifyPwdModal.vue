<template>
  <n-modal
    v-model:show="modalVisible"
    preset="dialog"
    :title="`修改用户 ${formParams.accountName} 密码`"
    :mask-closable="false"
    style="width: 600px"
  >
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
      <n-form-item label="用户姓名" path="accountName">
        <n-input v-model:value="formParams.accountName" readonly placeholder="用户真实姓名" />
      </n-form-item>
      <n-form-item label="新密码" path="secret">
        <n-input
          v-model:value="formParams.secret"
          type="password"
          placeholder="格式要求：8-16位字母和数字的组合"
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
  import { FormRules, FormItemRule, useMessage } from 'naive-ui';
  import md5 from 'md5';
  import { PWD_REGEXP } from '@/enums/validatorEnum';
  import { saveUser, getUserDetail } from '@/api/user';

  const message = useMessage();
  const formRef = ref();

  const defaultParams = () => ({
    id: null,
    userName: '',
    accountPosition: undefined,
    accountName: '',
    secret: '',
    reSecret: '',
    resourceIdList: [],
  });
  let formParams = reactive(defaultParams());

  const isConfirming = ref(false);
  const rules = reactive<FormRules>({
    secret: [
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
              if (value !== formParams.secret) {
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
        accountInfo: {
          id: formParams.id,
          userName: formParams.userName,
          accountPositionId: formParams.accountPosition,
          accountName: formParams.accountName,
          secret: md5(formParams.userName + md5(formParams.secret)) as string,
        },
        resourceIdList: formParams.resourceIdList,
      };

      saveUser(params)
        .then(() => {
          modalVisible.value = false;
          message.success('密码修改成功');
        })
        .finally(() => {
          isConfirming.value = false;
        });
    });
  };

  const modalVisible = ref(false);
  const show = async (id) => {
    formRef.value?.restoreValidation();
    modalVisible.value = true;
    await getUserDetail(id).then((user) => {
      formParams.id = user.accountId;
      formParams.userName = user.userName;
      formParams.accountPosition = user.accountPositionId;
      formParams.accountName = user.accountName;
      formParams.resourceIdList = user.resourceDTOList.map((item) => item.resourceId);
    });
  };

  defineExpose({
    show,
  });
</script>

<style></style>

<template>
  <n-card title="个人客户数量设置">
    <!-- <template #header-extra>
    </template> -->
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
      <n-form-item label="个人公海池客户数量上限" path="accountPoolCount">
        <n-input-number v-model:value="formParams.accountPoolCount" :show-button="false" />
      </n-form-item>
      <n-form-item label="单次申请至个人公海池客户数量上限" path="applyPoolCount">
        <n-input-number v-model:value="formParams.applyPoolCount" :show-button="false" />
      </n-form-item>
      <n-form-item label="个人E和D级客户数量上限" path="edCustomerCount">
        <n-input-number v-model:value="formParams.edCustomerCount" :show-button="false" />
      </n-form-item>
      <n-form-item label="个人C、B和A级客户数量上限" path="cbaCustomerCount">
        <n-input-number v-model:value="formParams.cbaCustomerCount" :show-button="false" />
      </n-form-item>
      <n-form-item label=" ">
        <n-button type="info" :loading="isConfirming" @click="handleConfirmClick"
          >保存设置</n-button
        >
      </n-form-item>
    </n-form>
  </n-card>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { FormRules, useMessage } from 'naive-ui';
  //   import { POSITIVE_INT_REGEXP } from '@/enums/validatorEnum';
  import * as ruleApi from '@/api/rule';

  const formRef = ref();

  const defaultParams = () => ({
    accountPoolCount: 50,
    applyPoolCount: 50,
    edCustomerCount: 50,
    cbaCustomerCount: 50,
  });
  let formParams = reactive(defaultParams());

  const isConfirming = ref(false);
  const message = useMessage();
  const handleConfirmClick = () => {
    formRef.value.validate((errors) => {
      if (errors) {
        return;
      }
      isConfirming.value = true;
      ruleApi
        .setCustomersQuantityRules(formParams)
        .then(() => {
          message.success('保存设置成功');
        })
        .finally(() => {
          isConfirming.value = false;
        });
    });
  };
  const rules = reactive<FormRules>({
    accountPoolCount: {
      required: true,
      type: 'integer',
      min: 1,
      trigger: ['blur', 'input'],
      message: '请输入正整数',
    },
    applyPoolCount: {
      required: true,
      type: 'integer',
      min: 1,
      trigger: ['blur', 'input'],
      message: '请输入正整数',
    },
    edCustomerCount: {
      required: true,
      type: 'integer',
      min: 1,
      trigger: ['blur', 'input'],
      message: '请输入正整数',
    },
    cbaCustomerCount: {
      required: true,
      type: 'integer',
      min: 1,
      trigger: ['blur', 'input'],
      message: '请输入正整数',
    },
  });

  ruleApi.getCustomersQuantityRules().then((res) => {
    formParams = Object.assign(formParams, res);
  });
</script>

<style></style>

<template>
  <n-card title="个人客户数量设置" style="margin-bottom: 12px">
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
      <n-form-item label="个人公海池客户数上限" path="accountPoolCount">
        <n-input-number v-model:value="formParams.accountPoolCount" :show-button="false" />
      </n-form-item>
      <n-form-item label="单次申请至个人公海池客户数上限" path="applyPoolCount">
        <n-input-number v-model:value="formParams.applyPoolCount" :show-button="false" />
      </n-form-item>
      <n-form-item label="个人E级客户数上限" path="ecustomerCount">
        <n-input-number v-model:value="formParams.ecustomerCount" :show-button="false" />
      </n-form-item>
      <n-form-item label="个人D、C、B和A级客户数上限" path="dcbaCustomerCount">
        <n-input-number v-model:value="formParams.dcbaCustomerCount" :show-button="false" />
      </n-form-item>
      <n-form-item label=" ">
        <n-button type="info" :loading="isConfirming" @click="handleConfirmClick"
          >保存设置</n-button
        >
      </n-form-item>
    </n-form>
  </n-card>

  <n-card title="自动掉入公海设置">
    <n-form
      ref="poolFormRef"
      :model="poolForm"
      :rules="poolRules"
      label-placement="left"
      label-align="right"
      label-width="auto"
      size="medium"
      require-mark-placement="right-hanging"
      style="margin: 30px 30px 0"
    >
      <n-form-item label="E级客户未升级掉公海天数" path="levelEDays">
        <n-input-number v-model:value="poolForm.levelEDays" :show-button="false" />
      </n-form-item>
      <n-form-item label="D级客户无跟进记录掉公海天数" path="levelDDays">
        <n-input-number v-model:value="poolForm.levelDDays" :show-button="false" />
      </n-form-item>
      <n-form-item label=" ">
        <n-button type="info" :loading="isConfirming2" @click="handleConfirmClick2"
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
  const poolFormRef = ref();
  const message = useMessage();

  let formParams = reactive({
    accountPoolCount: 10,
    applyPoolCount: 10,
    ecustomerCount: 10,
    dcbaCustomerCount: 10,
  });

  let poolForm = reactive({
    levelDDays: 10,
    levelEDays: 10,
  });

  const isConfirming = ref(false);
  const handleConfirmClick = () => {
    formRef.value.validate((errors) => {
      if (errors) {
        return;
      }
      isConfirming.value = true;
      ruleApi
        .setCustomersQuantityRules(formParams)
        .then(() => {
          message.success('保存个人客户数量设置成功');
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
    ecustomerCount: {
      required: true,
      type: 'integer',
      min: 1,
      trigger: ['blur', 'input'],
      message: '请输入正整数',
    },
    dcbaCustomerCount: {
      required: true,
      type: 'integer',
      min: 1,
      trigger: ['blur', 'input'],
      message: '请输入正整数',
    },
  });

  const isConfirming2 = ref(false);
  const handleConfirmClick2 = () => {
    poolFormRef.value.validate((errors) => {
      if (errors) {
        return;
      }
      isConfirming2.value = true;
      ruleApi
        .setFallingRules(poolForm)
        .then(() => {
          message.success('保存自动掉入公海设置成功');
        })
        .finally(() => {
          isConfirming2.value = false;
        });
    });
  };
  const poolRules = reactive<FormRules>({
    levelDDays: {
      required: true,
      type: 'integer',
      min: 1,
      trigger: ['blur', 'input'],
      message: '请输入正整数',
    },
    levelEDays: {
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

  ruleApi.getFallingRules().then((res) => {
    poolForm = Object.assign(poolForm, res);
  });
</script>

<style></style>

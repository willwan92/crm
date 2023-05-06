<template>
  <n-card title="客户信息显示设置">
    <n-form
      ref="customerFormRef"
      :model="customerForm"
      label-placement="left"
      label-align="right"
      :label-width="labelWidth"
      size="medium"
      require-mark-placement="right-hanging"
      style="margin: 30px 30px 0"
    >
      <n-form-item label="客户联系电话">
        <n-switch
          v-model:value="customerForm.curStatus"
          checked-value="CLOSE"
          unchecked-value="OPEN"
          :loading="isSwitching"
          @update:value="handleCurStatusChange"
        >
          <template #checked> 已显示 </template>
          <template #unchecked> 已隐藏 </template>
        </n-switch>
      </n-form-item>
    </n-form>
  </n-card>

  <n-card title="个人客户数量设置">
    <n-form
      ref="formRef"
      :model="formParams"
      :rules="rules"
      label-placement="left"
      label-align="right"
      :label-width="labelWidth"
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
      <n-form-item label="个人E级客户数上限" path="eCustomerCount">
        <n-input-number v-model:value="formParams.eCustomerCount" :show-button="false" />
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
      :label-width="labelWidth"
      size="medium"
      require-mark-placement="right-hanging"
      style="margin: 30px 30px 0"
    >
      <n-form-item label="E级客户未完成升级掉公海天数" path="levelEApprovalDays">
        <n-input-number v-model:value="poolForm.levelEApprovalDays" :show-button="false" />
      </n-form-item>
      <n-form-item label="D级客户未完成升级掉公海天数" path="levelDApprovalDays">
        <n-input-number v-model:value="poolForm.levelDApprovalDays" :show-button="false" />
      </n-form-item>
      <n-form-item label="D级客户无跟进记录掉公海天数" path="levelDFollowUpDays">
        <n-input-number v-model:value="poolForm.levelDFollowUpDays" :show-button="false" />
      </n-form-item>
      <n-form-item label="C级客户无跟进记录掉公海天数" path="levelCFollowUpDays">
        <n-input-number v-model:value="poolForm.levelCFollowUpDays" :show-button="false" />
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
  import * as ruleApi from '@/api/rule';

  const formRef = ref();
  const poolFormRef = ref();
  const labelWidth = 240;
  const message = useMessage();

  let formParams = reactive({
    accountPoolCount: 10,
    applyPoolCount: 10,
    eCustomerCount: 10,
    dcbaCustomerCount: 10,
  });

  let poolForm = reactive({
    levelEApprovalDays: 10,
    levelDApprovalDays: 10,
    levelDFollowUpDays: 10,
    levelCFollowUpDays: 10,
  });

  let customerForm = reactive({
    curStatus: '',
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
    eCustomerCount: {
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
    levelEApprovalDays: {
      required: true,
      type: 'integer',
      min: 1,
      trigger: ['blur', 'input'],
      message: '请输入正整数',
    },
    levelDApprovalDays: {
      required: true,
      type: 'integer',
      min: 1,
      trigger: ['blur', 'input'],
      message: '请输入正整数',
    },
    levelDFollowUpDays: {
      required: true,
      type: 'integer',
      min: 1,
      trigger: ['blur', 'input'],
      message: '请输入正整数',
    },
    levelCFollowUpDays: {
      required: true,
      type: 'integer',
      min: 1,
      trigger: ['blur', 'input'],
      message: '请输入正整数',
    },
  });

  const isSwitching = ref(false);
  const handleCurStatusChange = (value: string) => {
    isSwitching.value = true;
    let isOpen = value === 'OPEN';
    ruleApi
      .setCustomerRules({
        curStatus: isOpen ? 'CLOSE' : 'OPEN',
      })
      .then(() => {
        message.success(`客户联系电话已${isOpen ? '已显示' : '已隐藏'}`);
      })
      .finally(() => {
        isSwitching.value = false;
      });
  };

  ruleApi.getCustomersQuantityRules().then((res) => {
    formParams = Object.assign(formParams, res);
  });

  ruleApi.getFallingRules().then((res) => {
    poolForm = Object.assign(poolForm, res);
  });

  ruleApi.getCustomerRules().then((res) => {
    customerForm.curStatus = res;
  });
</script>

<style scoped>
  .n-card {
    margin-bottom: 12px;
  }
</style>

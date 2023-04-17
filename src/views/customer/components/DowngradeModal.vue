<template>
  <n-modal
    v-model:show="modalVisible"
    preset="dialog"
    title="客户降级"
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
      <n-form-item label="客户名称" path="">
        <n-input v-model:value="customerName" readonly placeholder="" />
      </n-form-item>
      <n-form-item label="降级原因" path="downgradeReason">
        <n-input v-model:value="formParams.downgradeReason" type="textarea" placeholder="" />
      </n-form-item>
      <n-form-item label="审批人" path="approveAccountId">
        <n-select
          v-model:value="formParams.approveAccountId"
          label-field="label"
          value-field="value"
          :options="approveAccountOptions"
          placeholder="请选择"
        />
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
  import { reactive, ref, defineExpose, defineEmits } from 'vue';
  import { FormRules } from 'naive-ui';
  import { getAuditAccountList, downgrade } from '@/api/audit';

  const formRef = ref();

  const approveAccountOptions = ref();

  const defaultParams = () => ({
    customerId: '',
    downgradeReason: '',
    approveAccountId: '',
  });
  let formParams = reactive(defaultParams());

  const isConfirming = ref(false);
  const rules = reactive<FormRules>({
    downgradeReason: [
      {
        required: true,
        trigger: ['blur', 'input'],
        message: '请输入降级原因',
      },
    ],
    approveAccountId: [
      {
        required: true,
        trigger: ['blur'],
        message: '请选择审批人',
      },
    ],
  });

  const emit = defineEmits(['ok']);
  const handleConfirmClick = () => {
    formRef.value?.validate((errors) => {
      if (errors) {
        return;
      }
      isConfirming.value = true;

      downgrade(formParams)
        .then(() => {
          emit('ok');
          modalVisible.value = false;
        })
        .finally(() => {
          isConfirming.value = false;
        });
    });
  };

  const modalVisible = ref(false);
  const customerName = ref();
  const show = async (row) => {
    customerName.value = row.customerName;
    formParams.customerId = row.id;
    formRef.value?.restoreValidation();
    modalVisible.value = true;

    getAuditAccountList(row.id, row.accountResourceId, 'DOWN').then((res) => {
      approveAccountOptions.value = res.map((item) => ({
        value: item.accountId,
        label: `${item.accountName}（${item.accountPositionName}）`,
      }));
    });
  };

  defineExpose({
    show,
  });
</script>

<style></style>

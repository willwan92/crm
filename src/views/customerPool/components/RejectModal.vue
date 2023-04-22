<template>
  <n-modal
    v-model:show="modalVisible"
    preset="dialog"
    title="拒绝申请"
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
      <n-form-item label="拒绝原因" path="rejectReason">
        <n-input v-model:value="formParams.rejectReason" type="textarea" placeholder="" />
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
  import { reject } from '@/api/audit';

  const formRef = ref();

  const defaultParams = () => ({
    auditRecordId: '',
    rejectReason: '',
  });
  let formParams = reactive(defaultParams());

  const isConfirming = ref(false);
  const rules = reactive<FormRules>({
    rejectReason: [
      {
        required: true,
        trigger: ['blur', 'input'],
        message: '请输入拒绝原因',
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

      reject(formParams)
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
  const show = async (id: string, name: string) => {
    customerName.value = name;
    formParams.auditRecordId = id;
    formRef.value?.restoreValidation();
    modalVisible.value = true;
  };

  defineExpose({
    show,
  });
</script>

<style></style>

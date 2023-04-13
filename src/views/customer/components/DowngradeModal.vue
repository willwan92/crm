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
      <n-form-item label="降级原因" path="followUpDesc">
        <n-input v-model:value="formParams.followUpDesc" type="textarea" placeholder="" />
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
  import { addFollowUpRecord } from '@/api/customer';

  const formRef = ref();

  const defaultParams = () => ({
    customerId: '',
    followUpDesc: '',
  });
  let formParams = reactive(defaultParams());

  const isConfirming = ref(false);
  const rules = reactive<FormRules>({
    followUpDesc: [
      {
        required: true,
        trigger: ['blur', 'input'],
        message: '请输入降级原因',
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

      addFollowUpRecord(formParams)
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
    formParams.customerId = id;
    formRef.value?.restoreValidation();
    modalVisible.value = true;
  };

  defineExpose({
    show,
  });
</script>

<style></style>

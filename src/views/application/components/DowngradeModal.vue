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
      label-placement="left"
      label-align="right"
      label-width="auto"
      size="medium"
      require-mark-placement="right-hanging"
      style="margin: 30px 30px 0"
    >
      <n-form-item label="客户名称" path="">
        <n-input v-model:value="formParams.customerName" readonly />
      </n-form-item>
      <n-form-item label="申请操作" path="">
        <n-input v-model:value="formParams.auditDesc" readonly />
      </n-form-item>
      <n-form-item label="审批人" path="">
        <n-input v-model:value="formParams.approveAccountName" readonly />
      </n-form-item>
      <n-form-item label="降级原因" path="">
        <n-input v-model:value="formParams.downgradeReason" readonly type="textarea" />
      </n-form-item>
    </n-form>
    <template #action>
      <n-space>
        <n-button @click="modalVisible = false">关闭</n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';

  let formParams = reactive<any>({});

  const modalVisible = ref(false);
  const show = async (row) => {
    formParams = row;
    modalVisible.value = true;
  };

  defineExpose({
    show,
  });
</script>

<style></style>

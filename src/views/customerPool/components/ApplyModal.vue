<template>
  <n-modal
    v-model:show="modalVisible"
    preset="dialog"
    title="公海池客户申请"
    :mask-closable="false"
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
      <n-form-item label="所属项目" path="projectId">
        <n-select
          style="width: 240px"
          clearable
          v-model:value="formParams.projectId"
          label-field="resourceName"
          value-field="resourceId"
          :options="projectOptions"
          :on-update:value="handleProjectChange"
        />
      </n-form-item>
      <n-form-item label="审批人" path="approveAccountId">
        <n-select
          v-model:value="formParams.approveAccountId"
          style="width: 240px"
          clearable
          :options="approveAccountOptions"
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
  import { useUserStore } from '@/store/modules/user';
  import { FormRules, useMessage } from 'naive-ui';
  import { getAuditAccountList, applyPublicCustomers } from '@/api/customerPool';

  const message = useMessage();
  const formRef = ref();
  const approveAccountOptions = ref();
  const projectOptions = ref();

  const defaultParams = () => ({
    customerCodeList: [''],
    projectId: '',
    approveAccountId: '',
  });
  let formParams = reactive(defaultParams());

  const handleProjectChange = (value) => {
    formParams.projectId = value;
    getAuditAccountList(formParams.projectId).then((res) => {
      approveAccountOptions.value = res.map((item) => ({
        value: item.accountId,
        label: `${item.accountName}（${item.accountPositionName}）`,
      }));
    });
  };

  const isConfirming = ref(false);
  const rules = reactive<FormRules>({
    projectId: [
      {
        required: true,
        trigger: ['blur', 'change'],
        message: '请选择所属项目',
      },
    ],
    approveAccountId: [
      {
        required: true,
        trigger: ['blur', 'change'],
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

      applyPublicCustomers(formParams)
        .then((res) => {
          message.success(res);
          emit('ok');
          modalVisible.value = false;
        })
        .finally(() => {
          isConfirming.value = false;
        });
    });
  };

  const modalVisible = ref(false);
  const show = async (customerCodeList: string[]) => {
    formRef.value?.restoreValidation();
    formParams.customerCodeList = customerCodeList;
    const userStore = useUserStore();
    const { resourceDTOList } = userStore?.info || {};
    projectOptions.value = resourceDTOList;
    modalVisible.value = true;
  };

  defineExpose({
    show,
  });
</script>

<style></style>

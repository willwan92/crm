<template>
  <n-form
    ref="searchRef"
    :model="searchParams"
    :inline="!getIsMobile"
    label-placement="left"
    label-width="auto"
    require-mark-placement="right-hanging"
  >
    <n-form-item label="客户名称" path="customerName">
      <n-input v-model:value="searchParams.customerName" placeholder="" />
    </n-form-item>
    <n-form-item label="申请单状态" path="auditStatus">
      <n-select
        v-model:value="searchParams.auditStatus"
        label-field="label"
        value-field="value"
        clearable
        :options="statusOptions"
        style="width: 120px"
        placeholder="全部"
      />
    </n-form-item>
    <n-space :justify="getIsMobile ? 'end' : 'start'">
      <n-button type="info" @click="emitReloadTable"> 查询 </n-button>
      <n-button @click="resetParams">重置 </n-button>
    </n-space>
  </n-form>
</template>

<script lang="ts" setup>
  import { unref, reactive, defineEmits, defineExpose } from 'vue';
  import { useProjectSetting } from '@/hooks/setting/useProjectSetting';

  const { getIsMobile } = useProjectSetting();

  const statusOptions = [
    {
      value: 'CREATED',
      label: '待审批',
    },
    {
      value: 'APPROVED',
      label: '已通过',
    },
    {
      value: 'REJECT',
      label: '已驳回',
    },
  ];

  const defaultParams = () => ({
    customerName: '',
    auditStatus: null,
  });

  let searchParams = reactive(defaultParams());

  defineExpose({
    searchParams,
  });

  function resetParams() {
    searchParams = Object.assign(unref(searchParams), defaultParams());
    emitReloadTable();
  }

  const emit = defineEmits(['reloadTable']);
  const emitReloadTable = () => {
    emit('reloadTable');
  };
</script>

<template>
  <n-form
    ref="searchRef"
    :model="searchParams"
    inline
    label-placement="left"
    require-mark-placement="right-hanging"
  >
    <n-form-item label="客户名称" path="customerName">
      <n-input v-model:value="searchParams.customerName" placeholder="客户名称" />
    </n-form-item>
    <n-form-item label="客户等级" path="customerLevel">
      <n-select
        v-model:value="searchParams.customerLevel"
        label-field="label"
        value-field="label"
        clearable
        :options="levelOptions"
        style="width: 120px"
        placeholder="全部"
      />
    </n-form-item>
    <n-form-item label="客户类型" path="cooperateStatus">
      <n-select
        v-model:value="searchParams.cooperateStatus"
        label-field="label"
        value-field="value"
        clearable
        :options="customerTypeOptions"
        style="width: 120px"
        placeholder="全部"
      />
    </n-form-item>
    <n-space>
      <n-button type="info" @click="emitReloadTable"> 查询 </n-button>
      <n-button @click="resetParams">重置 </n-button>
    </n-space>
  </n-form>
</template>

<script lang="ts" setup>
  import { unref, reactive, defineExpose } from 'vue';

  const levelOptions = [
    {
      value: -1,
      label: 'E',
    },
    {
      value: 0,
      label: 'D',
    },
    {
      value: 1,
      label: 'C',
    },
    {
      value: 2,
      label: 'B',
    },
    {
      value: 3,
      label: 'A',
    },
    {
      value: 4,
      label: 'O',
    },
  ];

  const customerTypeOptions = [
    {
      value: 1,
      label: '合作客户',
    },
    {
      value: 0,
      label: '自有客户',
    },
  ];

  const defaultParams = () => ({
    customerName: '',
    cooperateStatus: null,
    customerLevel: null,
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

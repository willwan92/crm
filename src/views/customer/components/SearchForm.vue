<template>
  <n-form
    ref="searchRef"
    :model="searchParams"
    inline
    label-placement="left"
    require-mark-placement="right-hanging"
  >
    <n-form-item label="客户名称" path="customerName">
      <n-input v-model:value="searchParams.customerName" placeholder="" />
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
    <!-- <n-form-item label="是否共享客户" path="shareStatus">
      <n-select
        v-model:value="searchParams.shareStatus"
        label-field="label"
        value-field="value"
        clearable
        :options="conditionOptions"
        style="width: 120px"
        placeholder="全部"
      />
    </n-form-item>
    <n-form-item label="是否合作客户" path="status">
      <n-select
        v-model:value="searchParams.status"
        label-field="label"
        value-field="value"
        clearable
        :options="conditionOptions"
        style="width: 120px"
        placeholder="全部"
      />
    </n-form-item> -->
    <n-space>
      <n-button type="info" @click="emitReloadTable"> 查询 </n-button>
      <n-button @click="resetParams">重置 </n-button>
    </n-space>
  </n-form>
</template>

<script lang="ts" setup>
  import { unref, reactive, defineEmits, defineExpose } from 'vue';
  import { QueryUserReq } from '@/api/models/user';

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

  //   const conditionOptions = [
  //     {
  //       value: 1,
  //       label: '是',
  //     },
  //     {
  //       value: 0,
  //       label: '否',
  //     },
  //   ];

  const defaultParams = () => ({
    customerName: '',
    customerLevel: null,
  });

  let searchParams = reactive<QueryUserReq>(defaultParams());

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

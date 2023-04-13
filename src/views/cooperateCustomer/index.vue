<template>
  <n-card :bordered="false" class="proCard">
    <BasicTable :toolbarShow="false" :columns="columns" :request="loadDataTable" ref="tableRef" />
  </n-card>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicTable } from '@/components/Table';
  import { getList } from '@/api/cooperate';

  const columns = [
    {
      title: '客户名称',
      key: 'customerName',
    },
    {
      title: '客户编号',
      key: 'customerCode',
    },
    {
      title: '合作发起时间',
      key: 'createTime',
    },
    {
      title: '我的业绩分成',
      key: 'division',
    },
    {
      title: '合作用户',
      key: 'targetAccountName',
    },
  ];

  const searchFormRef = ref();
  const loadDataTable = async (params) => {
    const res = await getList({ ...searchFormRef.value.searchParams, ...params });
    return res;
  };
</script>

<style lang="less" scoped></style>

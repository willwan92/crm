<template>
  <n-card :bordered="false" class="proCard">
    <BasicTable :toolbarShow="false" :columns="columns" :request="loadDataTable" ref="tableRef" />
  </n-card>
</template>

<script lang="ts" setup>
  import { BasicTable } from '@/components/Table';
  import { getPrivatePoolCustomers } from '@/api/customerPool';

  const columns = [
    {
      title: '序号',
      key: 'index',
      width: 60,
    },
    {
      title: '客户名称',
      key: 'customerName',
    },
    {
      title: '客户所在地区',
      key: 'mergerName',
    },
    {
      title: '所属行业',
      key: 'industry',
    },
    {
      title: '联系人',
      key: 'contactName',
    },
    {
      title: '联系电话',
      key: 'contactPhone',
    },
  ];

  const loadDataTable = async (params) => {
    const res = await getPrivatePoolCustomers(params);
    res.records = res.records.map((item, index) => {
      item.index = (res.current - 1) * res.size + index + 1;
      return item;
    });
    return res;
  };
</script>

<style lang="less" scoped></style>

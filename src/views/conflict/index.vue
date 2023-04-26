<template>
  <n-card :bordered="false" class="proCard">
    <BasicTable :toolbarShow="false" :columns="columns" :request="loadDataTable" ref="tableRef" />
  </n-card>
</template>

<script lang="ts" setup>
  import { BasicTable } from '@/components/Table';
  import { getList } from '@/api/conflict';
  import { formatToDateTime } from '@/utils/dateUtil';

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
      title: '所在项目',
      key: 'accountResourceName',
    },
    {
      title: '被撞单人',
      key: 'sourceAccountName',
    },
    {
      title: '被撞人职位',
      key: 'sourceAccountPosition',
    },
    {
      title: '撞单时间',
      width: 160,
      key: 'createTime',
    },
  ];

  const loadDataTable = async (params) => {
    const res = await getList(params);
    res.records = res.records.map((item, index) => {
      item.index = (res.current - 1) * res.size + index + 1;
      item.createTime = formatToDateTime(item.createTime);
      return item;
    });
    return res;
  };
</script>

<style lang="less" scoped></style>

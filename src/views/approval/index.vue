<template>
  <n-card :bordered="false" class="proCard">
    <SearchForm ref="searchFormRef" @reload-table="reloadTable" />

    <BasicTable :toolbarShow="false" :columns="columns" :request="loadDataTable" ref="tableRef" />
  </n-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { BasicTable } from '@/components/Table';
import { formatToDateTime } from '@/utils/dateUtil';
import { getApplyList } from '@/api/audit';
import SearchForm from './components/SearchForm.vue';

const columns = [
  {
    title: '序号',
    width: 60,
    key: 'index',
  },
  {
    title: '客户编号',
    key: 'customerCode',
  },
  {
    title: '客户名称',
    key: 'customerName',
  },
  {
    title: '操作类型',
    key: 'auditDesc',
  },
  {
    title: '审批人',
    key: 'approveAccountName',
  },
  {
    title: '申请时间',
    width: 160,
    key: 'applyTime',
  },
  {
    title: '审批时间',
    key: 'approvalTime',
    width: 160,
  },
  {
    title: '审批状态',
    key: 'auditStatusDesc',
  },
];


const searchFormRef = ref();
const loadDataTable = async (params) => {
  const res = await getApplyList({ ...searchFormRef.value.searchParams, ...params });
  res.records = res.records.map((item, index) => {
    item.applyTime = formatToDateTime(item.applyTime);
    item.approvalTime = item.approvalTime && formatToDateTime(item.approvalTime);
    item.index = (res.current - 1) * res.size + index + 1;
    return item;
  });
  return res;
};

const tableRef = ref();
function reloadTable() {
  tableRef.value.reload();
}
</script>

<style lang="less" scoped></style>

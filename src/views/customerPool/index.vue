<template>
  <n-card :bordered="false" class="proCard">
    <SearchForm ref="searchFormRef" @reload-table="reloadTable" />

    <n-button type="info" ghost title="申请至我的公海池"> 客户申请 </n-button>

    <BasicTable
      :toolbarShow="false"
      :columns="columns"
      :request="loadDataTable"
      ref="tableRef"
      :row-key="(row) => row.id"
      @update:checked-row-keys="handleCheck"
    />
  </n-card>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicTable } from '@/components/Table';
  import { formatToDateTime } from '@/utils/dateUtil';
  import { getpublicPoolCustomers } from '@/api/customerPool';
  import SearchForm from './components/SearchForm.vue';
  import { DataTableRowKey } from 'naive-ui';

  const columns = [
    {
      type: 'selection',
    },
    {
      title: '序号',
      width: 100,
      key: 'index',
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
      title: '创建时间',
      width: 160,
      key: 'createTime',
    },
    {
      title: '掉入公海时间',
      key: 'fallTime',
      width: 160,
    },
  ];

  const checkedRowKeysRef = ref<DataTableRowKey[]>([]);
  function handleCheck(rowKeys: DataTableRowKey[]) {
    console.log(rowKeys);

    checkedRowKeysRef.value = rowKeys;
  }

  //   const rejectModal = ref();
  //   const showRejectModal = (row) => {
  //     rejectModal.value.show(row.auditRecordId, row.customerName);
  //   };

  const searchFormRef = ref();
  const loadDataTable = async (params) => {
    const searchParams = searchFormRef.value.searchParams;
    const res = await getpublicPoolCustomers({
      areaId: searchParams.areaId,
      industry: searchParams.industry,
      //   startTime: searchParams.timerange[0],
      //   endTime: searchParams.timerange[1],
      ...params,
    });
    res.records = res.records.map((item, index) => {
      item.createTime = formatToDateTime(item.createTime);
      item.fallTime = formatToDateTime(item.fallTime);
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

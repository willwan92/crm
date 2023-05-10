<template>
  <n-card :bordered="false" class="proCard">
    <SearchForm ref="searchFormRef" @reload-table="reloadTable" />

    <n-button
      type="info"
      ghost
      title="申请至我的公海池"
      :disabled="!checkedRowKeys.length"
      @click="showApplyModal"
    >
      客户申请
    </n-button>

    <BasicTable
      :toolbarShow="false"
      :columns="columns"
      :request="loadDataTable"
      ref="tableRef"
      :row-key="(row) => row.customerCode"
      @update:checked-row-keys="handleCheck"
    />

    <ApplyModal ref="applyModal" @ok="reloadTable" />
  </n-card>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicTable } from '@/components/Table';
  import { formatToDateTime } from '@/utils/dateUtil';
  import { getpublicPoolCustomers } from '@/api/customerPool';
  import SearchForm from './components/SearchForm.vue';
  import ApplyModal from './components/ApplyModal.vue';
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

  const checkedRowKeys = ref<DataTableRowKey[]>([]);
  function handleCheck(rowKeys: DataTableRowKey[]) {
    checkedRowKeys.value = rowKeys;
  }

  const applyModal = ref();
  const showApplyModal = () => {
    applyModal.value.show(checkedRowKeys.value);
  };

  const searchFormRef = ref();
  const loadDataTable = async (params) => {
    const searchParams = searchFormRef.value.searchParams;
    const res = await getpublicPoolCustomers({
      areaIdList: searchParams.areaIdList,
      industry: searchParams.industry,
      startTime: searchParams.timerange && searchParams.timerange[0],
      endTime: searchParams.timerange && searchParams.timerange[1],
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

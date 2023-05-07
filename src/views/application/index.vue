<template>
  <n-card :bordered="false" class="proCard">
    <SearchForm ref="searchFormRef" @reload-table="reloadTable" />

    <BasicTable
      :toolbarShow="false"
      :columns="columns"
      :request="loadDataTable"
      ref="tableRef"
      :actionColumn="actionColumn"
    />

    <UpgradeModal ref="upgradeModal" />
    <DowngradeModal ref="downgradeModal" />
  </n-card>
</template>

<script lang="ts" setup>
  import { ref, reactive, h } from 'vue';
  import { NButton } from 'naive-ui';
  import { BasicTable } from '@/components/Table';
  import { formatToDateTime } from '@/utils/dateUtil';
  import { getApplyList } from '@/api/audit';
  import SearchForm from './components/SearchForm.vue';
  import UpgradeModal from './components/UpgradeModal.vue';
  import DowngradeModal from './components/DowngradeModal.vue';

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
    {
      title: '驳回原因',
      key: 'rejectReason',
    },
  ];

  const actionColumn = reactive({
    width: 220,
    title: '操作',
    key: 'action',
    align: 'center',
    render(row) {
      return [
        row.auditType === 'UP_DOWN_GRADE' &&
          h(
            NButton,
            {
              size: 'small',
              type: 'info',
              tertiary: true,
              style: 'margin-right:5px',
              onClick: () => showDetailModal(row),
            },
            { default: () => '申请详情' }
          ),
      ];
    },
  });

  const upgradeModal = ref();
  const downgradeModal = ref();
  const showDetailModal = (row) => {
    const upOrDown = row.upOrDown;
    if (upOrDown === 'UP') {
      upgradeModal.value.show(row);
    } else if (upOrDown === 'DOWN') {
      downgradeModal.value.show(row);
    }
  };

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

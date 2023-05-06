<template>
  <n-card>
    <SearchForm ref="searchFormRef" @reload-table="reloadTable" />

    <BasicTable
      :toolbarShow="false"
      :columns="columns"
      :actionColumn="actionColumn"
      :request="loadDataTable"
      ref="tableRef"
    />

    <RejectModal ref="rejectModal" @ok="reloadTable" />
  </n-card>
</template>

<script lang="ts" setup>
  import { ref, h, reactive } from 'vue';
  import { useRouter } from 'vue-router';
  import { BasicTable } from '@/components/Table';
  import { formatToDateTime } from '@/utils/dateUtil';
  import RejectModal from './components/RejectModal.vue';
  import { getAuditList, pass } from '@/api/audit';
  import SearchForm from './components/SearchForm.vue';
  import { NButton, useMessage, useDialog } from 'naive-ui';

  const message = useMessage();
  const dialog = useDialog();
  const router = useRouter();

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
      render(row) {
        return row.customerId
          ? h(
              NButton,
              {
                type: 'info',
                text: true,
                onClick: () => {
                  router.push('/customer/customer_detail/' + row.customerId);
                },
              },
              { default: () => row.customerName }
            )
          : row.customerName;
      },
    },
    {
      title: '操作类型',
      key: 'auditDesc',
    },
    {
      title: '审批状态',
      key: 'auditStatusDesc',
    },
    {
      title: '驳回原因',
      key: 'rejectReason',
    },
    {
      title: '发起人',
      key: 'applyAccountName',
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
  ];

  const actionColumn = reactive({
    width: 200,
    title: '审批选项',
    key: 'action',
    align: 'center',
    render(row) {
      return row.auditStatus === 'CREATED'
        ? [
            h(
              NButton,
              {
                size: 'small',
                type: 'info',
                tertiary: true,
                style: 'margin-right:5px',
                onClick: () => handlePassClick(row),
              },
              { default: () => '通过' }
            ),
            h(
              NButton,
              {
                size: 'small',
                type: 'error',
                tertiary: true,
                onClick: () => showRejectModal(row),
              },
              { default: () => '拒绝' }
            ),
          ]
        : `已${row.auditStatusDesc}`;
    },
  });

  function handlePassClick(row) {
    dialog.info({
      title: '提示',
      content: `确定通过客户 ${row.customerName} 的 ${row.auditDesc} 申请吗？`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        const res = await pass({
          auditRecordId: row.auditRecordId,
        });
        message.success(`客户 ${row.customerName}  的 ${row.auditDesc} ${res}`);
        reloadTable();
      },
    });
  }

  const rejectModal = ref();
  const showRejectModal = (row) => {
    rejectModal.value.show(row.auditRecordId, row.customerName);
  };

  const searchFormRef = ref();
  const loadDataTable = async (params) => {
    const res = await getAuditList({ ...searchFormRef.value.searchParams, ...params });
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

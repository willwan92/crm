<template>
  <n-card :bordered="false" class="proCard">
    <BasicTable
      :toolbarShow="false"
      :columns="columns"
      :actionColumn="actionColumn"
      :request="loadDataTable"
      ref="tableRef"
    />
  </n-card>
</template>

<script lang="ts" setup>
  import { ref, h, reactive } from 'vue';
  import { BasicTable } from '@/components/Table';
  import {
    getPrivatePoolCustomers,
    moveIntoMyCustomers,
    throwBackPublicCustomers,
  } from '@/api/customerPool';
  import { NButton, useMessage, useDialog } from 'naive-ui';

  const message = useMessage();
  const dialog = useDialog();

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

  const actionColumn = reactive({
    width: 220,
    title: '操作',
    key: 'action',
    align: 'center',
    render(row) {
      return [
        h(
          NButton,
          {
            size: 'small',
            type: 'info',
            tertiary: true,
            style: 'margin-right:5px',
            onClick: () => handleMoveClick(row),
          },
          { default: () => '转入我的客户' }
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'info',
            tertiary: true,
            onClick: () => handleThrowClick(row),
          },
          { default: () => '抛回公海' }
        ),
      ];
    },
  });

  function handleMoveClick(row) {
    dialog.info({
      title: '提示',
      content: `确定把 ${row.customerName} 转入我的客户吗？`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        await moveIntoMyCustomers({
          poolRecordId: row.id,
        });
        message.success(`客户 ${row.customerName} 已转入我的客户`);
        reloadTable();
      },
    });
  }

  function handleThrowClick(row) {
    dialog.info({
      title: '提示',
      content: `确定把客户 ${row.customerName} 抛回公海吗？`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        await throwBackPublicCustomers({
          poolRecordId: row.id,
        });
        message.success(`客户 ${row.customerName} 已抛回公海`);
        reloadTable();
      },
    });
  }

  const loadDataTable = async (params) => {
    const res = await getPrivatePoolCustomers(params);
    res.records = res.records.map((item, index) => {
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

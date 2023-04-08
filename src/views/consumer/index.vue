<template>
  <n-card :bordered="false" class="proCard">
    <SearchForm ref="searchFormRef" @reload-table="reloadTable" />

    <n-button type="info" ghost @click="showEditModal()"
      >添加
      <template #icon>
        <n-icon>
          <PlusOutlined />
        </n-icon>
      </template>
    </n-button>
    <BasicTable
      :toolbarShow="false"
      :columns="columns"
      :request="loadDataTable"
      :row-key="(row) => row.ip"
      ref="tableRef"
      :actionColumn="actionColumn"
    />

    <EditModal ref="editModal" @ok="reloadTable" />
  </n-card>
</template>

<script lang="ts" setup>
  import { reactive, ref, h } from 'vue';
  import { BasicTable } from '@/components/Table';
  import { getList } from '@/api/consumer';
  import EditModal from './components/EditModal.vue';
  import SearchForm from './components/SearchForm.vue';
  import { PlusOutlined } from '@vicons/antd';
  import { NButton, useMessage, useDialog } from 'naive-ui';

  const message = useMessage();
  const dialog = useDialog();

  const columns = [
    {
      title: '序号',
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
      title: '客户等级',
      key: 'customerLevel',
    },
    {
      title: '客户所有人',
      key: 'sourceAccountName',
    },
    {
      title: '招商项目',
      key: 'accountResourceName',
    },
    {
      title: '所在城市',
      key: 'cityName',
    },
    {
      title: '来源渠道',
      key: 'customerSource',
    },
    {
      title: '创建日期',
      key: 'createTime',
    },
    {
      title: '最新跟进日期',
      key: 'followUpTime',
    },
    {
      title: '未跟进天数',
      key: 'notFollowUpDays',
    },
  ];

  const actionColumn = reactive({
    width: 200,
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
            onClick: () => showEditModal(row.id),
          },
          { default: () => '跟进' }
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'info',
            tertiary: true,
            style: 'margin-right:5px',
            onClick: () => showEditModal(row.id),
          },
          { default: () => '升级' }
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'info',
            tertiary: true,
            style: 'margin-right:5px',
            onClick: () => showEditModal(row.id),
          },
          { default: () => '降级' }
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'info',
            tertiary: true,
            style: 'margin-right:5px',
            onClick: () => showEditModal(row.id),
          },
          { default: () => '共享' }
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'info',
            tertiary: true,
            style: 'margin-right:5px',
            onClick: () => showEditModal(row.id),
          },
          { default: () => '合作' }
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'info',
            tertiary: true,
            style: 'margin-right:5px',
            onClick: () => showEditModal(row.id),
          },
          { default: () => '抛入公海' }
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'error',
            tertiary: true,
            onClick: () => handleDelClick(row),
          },
          { default: () => '删除' }
        ),
      ];
    },
  });

  function handleDelClick(row) {
    dialog.warning({
      title: '提示',
      content: `确定要删除客户 ${row.accountName} 吗？`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        // await deleteUser(row.id);
        message.success(`用户 ${row.accountName} 已删除`);
        reloadTable();
      },
    });
  }

  const editModal = ref();
  const showEditModal = (id) => {
    editModal.value.show(id);
  };

  const searchFormRef = ref();
  const loadDataTable = async (params) => {
    const res = await getList({ ...searchFormRef.value.searchParams, ...params });
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

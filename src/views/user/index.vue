<template>
  <n-card :bordered="false" class="proCard">
    <SearchForm ref="searchFormRef" @reload-table="reloadTable" />

    <n-button type="info" ghost @click="showEditModal"
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
import { NTag } from 'naive-ui';
import { getUserList, deleteUser, updateUserStatus } from '@/api/user';
import EditModal from './components/EditModal.vue';
import SearchForm from './components/SearchForm.vue';
import { PlusOutlined } from '@vicons/antd';
import { NSwitch, NButton, useMessage, useDialog } from 'naive-ui';

const message = useMessage();
const dialog = useDialog();

const columns = [
  {
    title: '用户姓名',
    key: 'accountName',
  },
  {
    title: '职位',
    key: 'accountPosition',
  },
  {
    title: '登录名',
    key: 'userName',
  },
  {
    title: '状态',
    key: 'status',
    render(row) {
      return h(NSwitch, {
        defaultValue: row.status === 'enable',
        onUpdateValue: (value) => {
          setUserStatus(row.id, value);
        },
      });
    },
  },
];

const actionColumn = reactive({
  width: 150,
  title: '操作',
  key: 'action',
  align: 'center',
  render(row) {
    return [
      h(
        NButton,
        {
          type: 'error',
          size: 'small',
          ghost: true,
          style: 'margin-right:5px',
          onClick: () => handleDelClick(row),
        },
        { default: () => '删除' }
      ),
    ];
  },
});

const setUserStatus = async (userId, status) => {
  let res = await updateUserStatus({
    userId,
    status: status ? 0 : 1,
  });
  reloadTable();
};

function handleDelClick(row) {
  dialog.warning({
    title: '提示',
    content: `确定要用户 ${row.accountName} 吗？`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      await deleteUser(row.userId);
      message.success(`用户 ${row.accountName} 已删除`);
      reloadTable();
    },
  });
}

const editModal = ref();
const showEditModal = () => {
  editModal.value.show();
};

const searchFormRef = ref();
const loadDataTable = async (params) => {
  const res = await getUserList({ ...searchFormRef.value.searchParams, ...params });
  console.log(res);
  return res;
};

const tableRef = ref();
function reloadTable() {
  tableRef.value.reload();
}
</script>

<style lang="less" scoped></style>

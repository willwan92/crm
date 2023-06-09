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
    <ModifyPwdModal ref="modifyPwdModal" />
  </n-card>
</template>

<script lang="ts" setup>
  import { reactive, ref, h } from 'vue';
  import { BasicTable } from '@/components/Table';
  import { getUserList, deleteUser, updateUserStatus } from '@/api/user';
  import EditModal from './components/EditModal.vue';
  import ModifyPwdModal from './components/ModifyPwdModal.vue';
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
      key: 'accountPositionName',
    },
    {
      title: '登录名',
      key: 'userName',
    },
    {
      title: '所属项目',
      key: 'projectNameList',
    },
    {
      title: '状态(启用/禁用)',
      key: 'status',
      render(row) {
        return h(NSwitch, {
          value: !row.status,
          onUpdateValue: (value) => {
            setUserStatus(row.id, value);
          },
        });
      },
    },
  ];

  const actionColumn = reactive({
    title: '操作',
    key: 'action',
    width: 240,
    align: 'center',
    render(row) {
      return [
        h(
          NButton,
          {
            type: 'info',
            size: 'small',
            tertiary: true,
            style: 'margin-right:5px',
            onClick: () => showEditModal(row.id),
          },
          { default: () => '编辑' }
        ),
        h(
          NButton,
          {
            type: 'info',
            size: 'small',
            tertiary: true,
            style: 'margin-right:5px',
            onClick: () => showPwdModal(row.id),
          },
          { default: () => '修改密码' }
        ),
        h(
          NButton,
          {
            type: 'error',
            size: 'small',
            tertiary: true,
            onClick: () => handleDelClick(row),
          },
          { default: () => '删除' }
        ),
      ];
    },
  });

  const setUserStatus = async (userId, status) => {
    await updateUserStatus({
      userId,
      currentStatus: Number(status),
    });
    reloadTable();
  };

  function handleDelClick(row) {
    dialog.warning({
      title: '提示',
      content: `确定要删除用户 ${row.accountName} 吗？`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        await deleteUser(row.id);
        message.success(`用户 ${row.accountName} 已删除`);
        reloadTable();
      },
    });
  }

  const editModal = ref();
  const showEditModal = (id) => {
    editModal.value.show(id);
  };

  const modifyPwdModal = ref();
  const showPwdModal = (id) => {
    modifyPwdModal.value.show(id);
  };

  const searchFormRef = ref();
  const loadDataTable = async (params) => {
    const res = await getUserList({ ...searchFormRef.value.searchParams, ...params });
    res.records = res.records.map((item) => {
      item.projectNameList = Array.isArray(item.projectNameList) && item.projectNameList.join('，');
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

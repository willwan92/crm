<template>
  <n-card :bordered="false" class="proCard">
    <SearchForm ref="searchFormRef" @reload-table="reloadTable" />

    <n-button type="info" ghost @click="showEditModal('')"
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
      ref="tableRef"
      :actionColumn="actionColumn"
    />

    <EditModal ref="editModal" @ok="reloadTable" />
    <FollowUpModal ref="followUpModal" @ok="reloadTable" />
    <CooperateModal ref="cooperateModal" @ok="reloadTable" />
    <UpgradeModal ref="upgradeModal" @ok="reloadTable" />
    <DowngradeModal ref="downgradeModal" @ok="reloadTable" />
  </n-card>
</template>

<script lang="ts" setup>
  import { reactive, ref, h } from 'vue';
  import { useRouter } from 'vue-router';
  import { BasicTable } from '@/components/Table';
  import { getList, del } from '@/api/customer';
  import EditModal from './components/EditModal.vue';
  import FollowUpModal from './components/FollowUpModal.vue';
  import CooperateModal from './components/CooperateModal.vue';
  import UpgradeModal from './components/UpgradeModal.vue';
  import DowngradeModal from './components/DowngradeModal.vue';
  import SearchForm from './components/SearchForm.vue';
  import { PlusOutlined } from '@vicons/antd';
  import { formatToDate } from '@/utils/dateUtil';
  import { NButton, useMessage, useDialog } from 'naive-ui';

  const message = useMessage();
  const dialog = useDialog();
  const router = useRouter();

  const columns = [
    {
      title: '序号',
      key: 'index',
      width: '60',
    },
    {
      title: '客户编号',
      key: 'customerCode',
      width: '150',
    },
    {
      title: '客户名称',
      key: 'customerName',
      width: 200,
      render(row) {
        return h(
          NButton,
          {
            type: 'info',
            text: true,
            onClick: () => {
              router.push('/customer/customer_detail/' + row.id);
            },
          },
          { default: () => row.customerName }
        );
      },
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
          { default: () => '编辑' }
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'info',
            tertiary: true,
            style: 'margin-right:5px',
            onClick: () => showFollowUpModal(row.id, row.customerName),
          },
          { default: () => '跟进' }
        ),
        row.customerLevel !== 'O' &&
          h(
            NButton,
            {
              size: 'small',
              type: 'info',
              tertiary: true,
              style: 'margin-right:5px',
              onClick: () => showUpgradeModal(row),
            },
            { default: () => '升级' }
          ),
        row.customerLevel !== 'E' &&
          h(
            NButton,
            {
              size: 'small',
              type: 'info',
              tertiary: true,
              style: 'margin-right:5px',
              onClick: () => showDownModal(row),
            },
            { default: () => '降级' }
          ),
        row.customerLevel >= 'C' &&
          h(
            NButton,
            {
              size: 'small',
              type: 'info',
              tertiary: true,
              style: 'margin-right:5px',
              onClick: () => showCooperateModal(row),
            },
            { default: () => '合作' }
          ),
        // row.customerLevel === 'E' &&
        //   h(
        //     NButton,
        //     {
        //       size: 'small',
        //       type: 'info',
        //       tertiary: true,
        //       style: 'margin-right:5px',
        //       onClick: () => handleDiscardClick(row),
        //     },
        //     { default: () => '抛入公海' }
        //   ),
        row.customerLevel === 'E' &&
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
      content: `确定要删除客户 ${row.customerName} 吗？`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        await del(row.id);
        message.success(`客户 ${row.customerName} 已删除`);
        reloadTable();
      },
    });
  }

  //   function handleDiscardClick(row) {
  //     dialog.warning({
  //       title: '提示',
  //       content: `确定要把客户 ${row.customerName} 抛入公海吗？`,
  //       positiveText: '确定',
  //       negativeText: '取消',
  //       onPositiveClick: async () => {
  //         // await deleteUser(row.id);
  //         message.success(`客户 ${row.customerName} 已抛入公海`);
  //         reloadTable();
  //       },
  //     });
  //   }

  const editModal = ref();
  const showEditModal = (id) => {
    editModal.value.show(id);
  };

  const followUpModal = ref();
  const showFollowUpModal = (id, name) => {
    followUpModal.value.show(id, name);
  };

  const cooperateModal = ref();
  const showCooperateModal = (row) => {
    cooperateModal.value.show(row);
  };

  const upgradeModal = ref();
  const showUpgradeModal = (row) => {
    upgradeModal.value.show(row);
  };

  const downgradeModal = ref();
  const showDownModal = (row) => {
    downgradeModal.value.show(row);
  };

  const searchFormRef = ref();
  const loadDataTable = async (params) => {
    const res = await getList({ ...searchFormRef.value.searchParams, ...params });
    res.records = res.records.map((item, index) => {
      item.index = (res.current - 1) * res.size + index + 1;
      item.createTime = formatToDate(item.createTime);
      item.followUpTime = formatToDate(item.followUpTime);
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

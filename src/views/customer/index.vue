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
      :scroll-x="1400"
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
  import { BasicTable, TableAction } from '@/components/Table';
  import { getList, del, throwCustomer } from '@/api/customer';
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
    },
    {
      title: '客户名称',
      key: 'customerName',
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
      title: '客户类型',
      key: 'isCooperated',
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
    {
      title: '预计掉公海日期',
      key: 'gotoPublicPoolDate',
    },
  ];

  const handleSelectAction = (key: string, row) => {
    const actions = {
      showFollowUpModal: showFollowUpModal,
      showUpgradeModal: showUpgradeModal,
      showDownModal: showDownModal,
      showCooperateModal: showCooperateModal,
      handleDiscardClick: handleDiscardClick,
      handleDelClick: handleDelClick,
    };
    actions[key](row);
  };

  const actionColumn = reactive({
    width: 150,
    title: '操作',
    key: 'action',
    align: 'center',
    fixed: 'right',
    render(row) {
      return h(TableAction as any, {
        style: 'button',
        actions: [
          {
            label: '编辑',
            type: 'default',
            tertiary: true,
            style: 'margin-right:5px',
            onClick: showEditModal.bind(null, row.id),
          },
        ],
        dropDownActions: [
          {
            label: '跟进',
            key: 'showFollowUpModal',
          },
          {
            label: '升级',
            key: 'showUpgradeModal',
            ifShow: () => {
              return row.customerLevel !== 'O';
            },
          },
          {
            label: '降级',
            key: 'showDownModal',
            ifShow: () => {
              return row.customerLevel < 'D';
            },
          },
          {
            label: '合作',
            key: 'showCooperateModal',
            ifShow: () => {
              return row.isCooperated === '自有客户' && row.customerLevel < 'E';
            },
          },
          {
            label: '抛入公海',
            key: 'handleDiscardClick',
          },
          {
            label: '删除',
            key: 'handleDelClick',
            ifShow: () => {
              return row.customerLevel === 'E';
            },
          },
        ],
        select: (key) => handleSelectAction(key, row),
      });
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

  function handleDiscardClick(row) {
    dialog.warning({
      title: '提示',
      content: `确定要把客户 ${row.customerName} 抛入公海吗？`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        const res = await throwCustomer(row.id);
        message.success(`客户 ${row.customerName} ${res}`);
        reloadTable();
      },
    });
  }

  const editModal = ref();
  const showEditModal = (id) => {
    editModal.value.show(id);
  };

  const followUpModal = ref();
  const showFollowUpModal = (row) => {
    followUpModal.value.show(row.id, row.customerName);
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
      item.isCooperated = item.isCooperated ? '合作客户' : '自有客户';

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

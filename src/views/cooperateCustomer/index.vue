<template>
  <n-card :bordered="false" class="proCard">
    <BasicTable :toolbarShow="false" :columns="columns" :request="loadDataTable" ref="tableRef" />
  </n-card>
</template>

<script lang="ts" setup>
  import { h } from 'vue';
  import { useRouter } from 'vue-router';
  import { BasicTable } from '@/components/Table';
  import { getList } from '@/api/cooperate';
  import { formatToDateTime } from '@/utils/dateUtil';
  import { NButton } from 'naive-ui';

  const router = useRouter();

  const columns = [
    {
      title: '序号',
      key: 'index',
      width: '100',
    },
    {
      title: '客户名称',
      width: '160',
      key: 'customerName',
      render(row) {
        return h(
          NButton,
          {
            type: 'info',
            text: true,
            onClick: () => {
              router.push('/customer/customer_detail/' + row.customerId);
            },
          },
          { default: () => row.customerName }
        );
      },
    },
    {
      title: '客户编号',
      key: 'customerCode',
    },
    {
      title: '合作发起时间',
      key: 'createTime',
    },
    {
      title: '我的业绩分成',
      key: 'division',
    },
    {
      title: '合作用户',
      key: 'targetAccountName',
    },
  ];

  const loadDataTable = async (params) => {
    const res = await getList(params);
    res.records = res.records.map((item, index) => {
      item.index = (res.current - 1) * res.size + index + 1;
      item.createTime = formatToDateTime(item.createTime);
      return item;
    });
    return res;
  };
</script>

<style lang="less" scoped></style>

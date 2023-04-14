<template>
  <n-card title="客户基本信息" class="card">
    <template #header-extra>
      <n-button type="info" ghost @click="$router.back()">
        返回
        <n-icon>
          <RollbackOutlined />
        </n-icon>
      </n-button>
    </template>
    <n-spin :show="loading">
      <n-descriptions label-placement="left" bordered>
        <n-descriptions-item label="招商项目">
          {{ baseInfo.accountResourceName }}
        </n-descriptions-item>
        <n-descriptions-item label="客户名称">
          {{ baseInfo.customerName }}
        </n-descriptions-item>
        <n-descriptions-item label="客户来源">
          {{ baseInfo.customerSource }}
        </n-descriptions-item>
        <n-descriptions-item label="组织机构代码">
          {{ baseInfo.organizationCode }}
        </n-descriptions-item>
        <n-descriptions-item label="客户所在地区">
          {{ baseInfo.mergerName }}
        </n-descriptions-item>
        <n-descriptions-item label="注册地址">
          {{ baseInfo.registerAddress }}
        </n-descriptions-item>

        <n-descriptions-item label="注册资本">
          {{ baseInfo.registerCapital }}
        </n-descriptions-item>
        <n-descriptions-item label="注册时间">
          {{ baseInfo.registerTime && formatToDate(baseInfo.registerTime) }}
        </n-descriptions-item>
        <n-descriptions-item label="关联企业">
          {{ baseInfo.relaEnterprises }}
        </n-descriptions-item>
        <n-descriptions-item label="联系人"> {{ baseInfo.contactName }} </n-descriptions-item>
        <n-descriptions-item label="联系人职务">
          {{ baseInfo.contactPosition }}
        </n-descriptions-item>
        <n-descriptions-item label="联系电话">
          {{ baseInfo.contactPhone }}
        </n-descriptions-item>

        <n-descriptions-item label="所属行业">
          {{ baseInfo.industry }}
        </n-descriptions-item>
        <n-descriptions-item label="主营产品">
          {{ baseInfo.mainProduct }}
        </n-descriptions-item>
        <n-descriptions-item label="现有场地">
          {{ baseInfo.spaceCondition }} 平米
        </n-descriptions-item>
        <n-descriptions-item label="租售类型">
          {{ baseInfo.rentType }}
        </n-descriptions-item>
        <n-descriptions-item label="需求业态">
          {{ baseInfo.unitType }}
        </n-descriptions-item>
        <n-descriptions-item label="需求面积">
          {{ baseInfo.requireArea }} 平米
        </n-descriptions-item>
      </n-descriptions>
    </n-spin>
  </n-card>
  <n-card title="客户跟进记录">
    <n-descriptions
      v-if="followUpRecords.length"
      label-placement="left"
      :column="1"
      bordered
      label-style="width: 200px;"
    >
      <n-descriptions-item
        v-for="item in followUpRecords"
        :key="item.followUpRecordId"
        :label="formatToDate(item.followUpTime)"
      >
        {{ item.followUpDesc }}
      </n-descriptions-item>
    </n-descriptions>
    <n-empty v-else description="无跟进记录" />
  </n-card>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { RollbackOutlined } from '@vicons/antd';
  import { getDetail } from '@/api/customer';
  import { formatToDate } from '@/utils/dateUtil';
  import { useRoute } from 'vue-router';

  const loading = ref(true);
  const baseInfo = ref<any>({});
  const followUpRecords = ref<any>([]);
  const { params } = useRoute();
  getDetail(params.id)
    .then((res) => {
      baseInfo.value = res.baseInfoDTO;
      followUpRecords.value = res.followUpRecordDTOS;
    })
    .finally(() => (loading.value = false));
</script>

<style lang="less" scoped>
  .card {
    margin-bottom: 10px;
  }
</style>

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
        <n-descriptions-item label="客户所属人">
          {{ baseInfo.sourceAccountName }}
        </n-descriptions-item>
        <n-descriptions-item label="客户级别">
          {{ baseInfo.customerLevel }}
        </n-descriptions-item>
        <n-descriptions-item label="客户编号">
          {{ baseInfo.customerCode }}
        </n-descriptions-item>
        <n-descriptions-item label="招商项目">
          {{ baseInfo.accountResourceName }}
        </n-descriptions-item>
        <n-descriptions-item label="客户名称">
          {{ baseInfo.customerName }}
        </n-descriptions-item>
        <n-descriptions-item label="客户来源">
          {{ baseInfo.customerSource }}
        </n-descriptions-item>
        <n-descriptions-item label="客户所在地区">
          {{ baseInfo.mergerName }}
        </n-descriptions-item>
        <n-descriptions-item label="需求业态">
          {{ baseInfo.unitType }}
        </n-descriptions-item>
        <n-descriptions-item label="需求面积">
          {{ baseInfo.requireArea }} 平米
        </n-descriptions-item>
        <n-descriptions-item label="联系人"> {{ baseInfo.contactName }} </n-descriptions-item>
        <n-descriptions-item label="联系电话">
          {{ baseInfo.contactPhone }}
        </n-descriptions-item>
        <n-descriptions-item label="联系人职务">
          {{ baseInfo.contactPosition }}
        </n-descriptions-item>
        <n-descriptions-item label="注册资本">
          {{ baseInfo.registerCapital }}
        </n-descriptions-item>
        <n-descriptions-item label="注册时间">
          {{ baseInfo.registerTime && formatToDate(baseInfo.registerTime) }}
        </n-descriptions-item>
        <n-descriptions-item label="注册地址">
          {{ baseInfo.registerAddress }}
        </n-descriptions-item>
        <n-descriptions-item label="主营产品">
          {{ baseInfo.mainProduct }}
        </n-descriptions-item>
        <n-descriptions-item label="所属行业">
          {{ baseInfo.industry }}
        </n-descriptions-item>
        <n-descriptions-item label="关联企业">
          {{ baseInfo.relaEnterprises }}
        </n-descriptions-item>
        <n-descriptions-item label="组织机构代码">
          {{ baseInfo.organizationCode }}
        </n-descriptions-item>
        <n-descriptions-item label="现有场地">
          {{ baseInfo.spaceCondition && `${baseInfo.spaceCondition} 平米` }}
        </n-descriptions-item>
        <n-descriptions-item label="需求类型">
          {{ baseInfo.rentType }}
        </n-descriptions-item>
      </n-descriptions>
    </n-spin>
  </n-card>

  <n-card v-if="baseInfo.isCooperated" title="客户合作信息" class="card">
    <n-descriptions label-placement="left" bordered>
      <n-descriptions-item label="合作人">
        {{ baseInfo.createBy }}
      </n-descriptions-item>
      <n-descriptions-item label="合作人业绩分成">
        {{ baseInfo.division }}
      </n-descriptions-item>
    </n-descriptions>
  </n-card>

  <n-card title="客户升级信息" class="card">
    <n-spin :show="loading">
      <n-descriptions
        v-if="baseInfo.customerLevel < 'D' || baseInfo.customerLevel === 'O'"
        label-placement="left"
        bordered
        :column="4"
      >
        <template v-if="baseInfo.customerLevel < 'D' || baseInfo.customerLevel === 'O'">
          <n-descriptions-item label="升级操作"> D升C </n-descriptions-item>
          <n-descriptions-item label="来访时间">
            {{ baseInfo.visitTime && formatToDate(baseInfo.visitTime) }}
          </n-descriptions-item>
          <n-descriptions-item label="来访人员">
            {{ baseInfo.visitName }}
          </n-descriptions-item>
          <n-descriptions-item label="来访人电话">
            {{ baseInfo.visitPhone }}
          </n-descriptions-item>
        </template>

        <template v-if="baseInfo.customerLevel < 'C' || baseInfo.customerLevel === 'O'">
          <n-descriptions-item label="升级操作"> C升B </n-descriptions-item>
          <n-descriptions-item label="锁定房源">
            {{ baseInfo.lockHouseResource }}
          </n-descriptions-item>
          <n-descriptions-item label="房源面积">
            {{ baseInfo.lockHouseArea }} 平米
          </n-descriptions-item>
          <n-descriptions-item label="意向金额">
            {{ baseInfo.lockIntendedAmount }} 元
          </n-descriptions-item>
        </template>

        <template v-if="baseInfo.customerLevel < 'B' || baseInfo.customerLevel === 'O'">
          <n-descriptions-item label="升级操作"> B升A </n-descriptions-item>
          <n-descriptions-item label="认购房源">
            {{ baseInfo.offerHouseResource }}
          </n-descriptions-item>
          <n-descriptions-item label="认购面积">
            {{ baseInfo.offerHouseArea }} 平米
          </n-descriptions-item>
          <n-descriptions-item label="定金金额">
            {{ baseInfo.depositAmount }} 元
          </n-descriptions-item>
        </template>

        <template v-if="baseInfo.customerLevel < 'A' || baseInfo.customerLevel === 'O'">
          <n-descriptions-item label="升级操作"> A升O </n-descriptions-item>
          <n-descriptions-item label="签约时间">
            {{ baseInfo.signTime && formatToDate(baseInfo.signTime) }}
          </n-descriptions-item>
          <n-descriptions-item label="首付金额">
            {{ baseInfo.downPaymentAmount }} 元
          </n-descriptions-item>
          <n-descriptions-item label="首付期限">
            {{ baseInfo.downPaymentTime && formatToDate(baseInfo.downPaymentTime) }}
          </n-descriptions-item>
        </template>
      </n-descriptions>

      <n-empty v-else description="无客户升级信息" />
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

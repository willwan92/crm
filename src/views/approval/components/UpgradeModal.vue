<template>
  <n-modal
    v-model:show="modalVisible"
    preset="dialog"
    title="客户升级申请"
    :mask-closable="false"
    style="width: 600px"
  >
    <n-form
      ref="formRef"
      :model="formParams"
      label-placement="left"
      label-align="right"
      label-width="auto"
      size="medium"
      require-mark-placement="right-hanging"
      style="margin: 30px 30px 0"
    >
      <n-form-item label="客户名称" path="">
        <n-input v-model:value="formParams.customerName" readonly />
      </n-form-item>
      <n-form-item label="申请操作" path="">
        <n-input v-model:value="formParams.auditDesc" readonly />
      </n-form-item>
      <div v-show="currentLevel === 'D'">
        <n-form-item label="来访时间" path="visitTime">
          <n-date-picker v-model:value="formParams.visitTime" type="date" readonly />
        </n-form-item>
        <n-form-item label="来访人员" path="visitName">
          <n-input v-model:value="formParams.visitName" readonly />
        </n-form-item>
        <n-form-item label="来访人电话" path="visitPhone">
          <n-input v-model:value="formParams.visitPhone" readonly />
        </n-form-item>
      </div>

      <div v-show="currentLevel === 'C'">
        <n-form-item label="锁定房源" path="lockHouseResource">
          <n-input v-model:value="formParams.lockHouseResource" readonly />
        </n-form-item>
        <n-form-item label="房源面积" path="lockHouseArea">
          <n-input v-model:value="formParams.lockHouseArea" readonly>
            <template #suffix> 平米 </template>
          </n-input>
        </n-form-item>
        <n-form-item label="意向金额" path="lockIntendedAmount" readonly>
          <n-input v-model:value="formParams.lockIntendedAmount">
            <template #suffix> 元 </template>
          </n-input>
        </n-form-item>
      </div>

      <div v-show="currentLevel === 'B'">
        <n-form-item label="认购房源" path="offerHouseResource">readonly </n-form-item>
        <n-form-item label="认购面积" path="offerHouseArea">
          <n-input v-model:value="formParams.offerHouseArea" readonly>
            <template #suffix> 平米 </template>
          </n-input>
        </n-form-item>
        <n-form-item label="定金金额" path="depositAmount">
          <n-input v-model:value="formParams.depositAmount" readonly>
            <template #suffix> 元 </template>
          </n-input>
        </n-form-item>
      </div>

      <div v-show="currentLevel === 'A'">
        <n-form-item label="签约时间" path="signTime">
          <n-date-picker v-model:value="formParams.signTime" type="date" readonly />
        </n-form-item>
        <n-form-item label="首付金额" path="downPaymentAmount">
          <n-input v-model:value="formParams.downPaymentAmount" readonly>
            <template #suffix> 元 </template>
          </n-input>
        </n-form-item>
        <n-form-item label="首付期限" path="downPaymentTime">
          <n-date-picker v-model:value="formParams.downPaymentTime" type="date" readonly />
        </n-form-item>
      </div>

      <n-form-item label="审批人" path="approveAccountName">
        <n-input v-model:value="formParams.approveAccountName" readonly />
      </n-form-item>
    </n-form>
    <template #action>
      <n-space>
        <n-button @click="modalVisible = false">关闭</n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';

  let formParams = reactive<any>({});

  const modalVisible = ref(false);
  const currentLevel = ref('');
  const show = async (row) => {
    formParams = row;
    currentLevel.value = row.oldCustomerLevel;
    modalVisible.value = true;
  };

  defineExpose({
    show,
  });
</script>

<style lang="less" scoped>
  .n-date-picker {
    width: 378px;
  }
</style>

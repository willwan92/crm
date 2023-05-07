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
      :rules="rules"
      label-placement="left"
      label-align="right"
      label-width="auto"
      size="medium"
      require-mark-placement="right-hanging"
      style="margin: 30px 30px 0"
    >
      <n-form-item label="客户名称" path="">
        <n-input v-model:value="customerName" readonly placeholder="" />
      </n-form-item>
      <n-form-item label="申请升级级别" path="">
        <n-input v-model:value="upgradeMap[currentLevel].title" readonly placeholder="" />
      </n-form-item>
      <div v-show="currentLevel === 'D'">
        <n-form-item label="来访时间" path="visitTime">
          <n-date-picker v-model:value="formParams.visitTime" type="date" placeholder="" />
        </n-form-item>
        <n-form-item label="来访人员" path="visitName">
          <n-input v-model:value="formParams.visitName" placeholder="" />
        </n-form-item>
        <n-form-item label="来访人电话" path="visitPhone">
          <n-input v-model:value="formParams.visitPhone" placeholder="" />
        </n-form-item>
      </div>

      <div v-show="currentLevel === 'C'">
        <n-form-item label="锁定房源" path="lockHouseResource">
          <n-input v-model:value="formParams.lockHouseResource" placeholder="" />
        </n-form-item>
        <n-form-item label="房源面积" path="lockHouseArea">
          <n-input v-model:value="formParams.lockHouseArea" placeholder="">
            <template #suffix> 平米 </template>
          </n-input>
        </n-form-item>
        <n-form-item label="意向金额" path="lockIntendedAmount">
          <n-input v-model:value="formParams.lockIntendedAmount" placeholder="">
            <template #suffix> 元 </template>
          </n-input>
        </n-form-item>
      </div>

      <div v-show="currentLevel === 'B'">
        <n-form-item label="认购房源" path="offerHouseResource">
          <n-input v-model:value="formParams.offerHouseResource" placeholder="" />
        </n-form-item>
        <n-form-item label="认购面积" path="offerHouseArea">
          <n-input v-model:value="formParams.offerHouseArea" placeholder="">
            <template #suffix> 平米 </template>
          </n-input>
        </n-form-item>
        <n-form-item label="定金金额" path="depositAmount">
          <n-input v-model:value="formParams.depositAmount" placeholder="">
            <template #suffix> 元 </template>
          </n-input>
        </n-form-item>
      </div>

      <div v-show="currentLevel === 'A'">
        <n-form-item label="签约时间" path="signTime">
          <n-date-picker v-model:value="formParams.signTime" type="date" placeholder="" />
        </n-form-item>
        <n-form-item label="首付金额" path="downPaymentAmount">
          <n-input v-model:value="formParams.downPaymentAmount" placeholder="">
            <template #suffix> 元 </template>
          </n-input>
        </n-form-item>
        <n-form-item label="首付期限" path="downPaymentTime">
          <n-date-picker v-model:value="formParams.downPaymentTime" type="date" placeholder="" />
        </n-form-item>
      </div>

      <n-form-item label="审批人" path="approveAccountId">
        <n-select
          v-model:value="formParams.approveAccountId"
          label-field="label"
          value-field="value"
          :options="approveAccountOptions"
          placeholder="请选择"
        />
      </n-form-item>
    </n-form>
    <template #action>
      <n-space>
        <n-button type="info" :loading="isConfirming" @click="handleConfirmClick"
          >发起申请</n-button
        >
        <n-button @click="modalVisible = false">取消</n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
  import { reactive, ref, unref, defineExpose, defineEmits } from 'vue';
  import { FormRules } from 'naive-ui';
  import { MOBILE_REGEXP, POSITIVE_FLOAT_REGEXP } from '@/enums/validatorEnum';
  import { getAuditAccountList, upgrade } from '@/api/audit';

  const formRef = ref();

  const currentLevel = ref('D');
  const upgradeMap = {
    E: {
      title: 'D',
      params: [],
    },
    D: {
      title: 'C',
      params: ['visitName', 'visitPhone', 'visitTime'],
      rules: {
        visitName: [
          {
            required: true,
            trigger: ['blur', 'input'],
            message: '请输入来访人员',
          },
        ],
        visitPhone: [
          { required: true, trigger: ['blur', 'input'], message: '请输入来访人电话' },
          { pattern: MOBILE_REGEXP, trigger: ['blur', 'input'], message: '手机号格式错误' },
        ],
        visitTime: [
          {
            required: true,
            type: 'integer',
            trigger: ['change'],
            message: '请输入来访时间',
          },
        ],
      },
    },
    C: {
      title: 'B',
      params: ['lockHouseArea', 'lockHouseResource', 'lockIntendedAmount'],
      rules: {
        lockHouseResource: [
          {
            required: true,
            trigger: ['blur', 'input'],
            message: '请输入锁定房源',
          },
        ],
        lockHouseArea: [
          { required: true, trigger: ['blur', 'input'], message: '请输入锁定房源面积' },
          {
            pattern: POSITIVE_FLOAT_REGEXP,
            trigger: ['blur', 'input'],
            message: '请输入正整数或保留两位小数',
          },
        ],
        lockIntendedAmount: [
          { required: true, trigger: ['blur', 'input'], message: '请输入意向金额' },
          {
            pattern: POSITIVE_FLOAT_REGEXP,
            trigger: ['blur', 'input'],
            message: '请输入正整数或保留两位小数',
          },
        ],
      },
    },
    B: {
      title: 'A',
      params: ['depositAmount', 'offerHouseArea', 'offerHouseResource'],
      rules: {
        offerHouseResource: [
          {
            required: true,
            trigger: ['blur', 'input'],
            message: '请输入认购房源',
          },
        ],
        offerHouseArea: [
          { required: true, trigger: ['blur', 'input'], message: '请输入认购房源面积' },
          {
            pattern: POSITIVE_FLOAT_REGEXP,
            trigger: ['blur', 'input'],
            message: '请输入正整数或保留两位小数',
          },
        ],
        depositAmount: [
          { required: true, trigger: ['blur', 'input'], message: '请输入定金金额' },
          {
            pattern: POSITIVE_FLOAT_REGEXP,
            trigger: ['blur', 'input'],
            message: '请输入正整数或保留两位小数',
          },
        ],
      },
    },
    A: {
      title: 'O',
      params: ['downPaymentAmount', 'downPaymentTime', 'signTime'],
      rules: {
        downPaymentAmount: [
          { required: true, trigger: ['blur', 'input'], message: '请输入首付款' },
          {
            pattern: POSITIVE_FLOAT_REGEXP,
            trigger: ['blur', 'input'],
            message: '请输入正整数或保留两位小数',
          },
        ],
        downPaymentTime: [
          {
            required: true,
            type: 'integer',
            trigger: ['change'],
            message: '请输入首付期限',
          },
        ],
        signTime: [
          {
            required: true,
            type: 'integer',
            trigger: ['change'],
            message: '请输入签约时间',
          },
        ],
      },
    },
  };

  const approveAccountOptions = ref();

  const defaultParams = () => ({
    approveAccountId: '',
    customerId: '',
    depositAmount: '',
    downPaymentAmount: '',
    downPaymentTime: undefined,
    lockHouseArea: '',
    lockHouseResource: '',
    lockIntendedAmount: '',
    offerHouseArea: '',
    offerHouseResource: '',
    signTime: undefined,
    visitName: '',
    visitPhone: '',
    visitTime: undefined,
  });
  let formParams = reactive(defaultParams());

  const isConfirming = ref(false);
  let rules = reactive<FormRules>({});

  const emit = defineEmits(['ok']);
  const handleConfirmClick = () => {
    formRef.value?.validate((errors) => {
      if (errors) {
        return;
      }
      isConfirming.value = true;

      upgrade(formParams)
        .then(() => {
          modalVisible.value = false;
          emit('ok');
        })
        .finally(() => {
          isConfirming.value = false;
        });
    });
  };

  const modalVisible = ref(false);
  const customerName = ref();
  const show = async (row) => {
    customerName.value = row.customerName;
    currentLevel.value = row.customerLevel;
    formParams = Object.assign(unref(formParams), defaultParams());
    formParams.customerId = row.id;
    formRef.value?.restoreValidation();
    rules = Object.assign(
      {
        approveAccountId: [
          {
            required: true,
            trigger: ['blur'],
            message: '请选择审批人',
          },
        ],
      },
      upgradeMap[currentLevel.value].rules
    );
    modalVisible.value = true;

    getAuditAccountList(row.id, row.accountResourceId, 'UP').then((res) => {
      approveAccountOptions.value = res.map((item) => ({
        value: item.accountId,
        label: `${item.accountName}（${item.accountPositionName}）`,
      }));
    });
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

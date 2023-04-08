<template>
  <n-modal
    v-model:show="modalVisible"
    preset="dialog"
    title="添加客户"
    :mask-closable="false"
    style="width: 800px"
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
      <n-grid x-gap="12" :cols="3">
        <n-gi>
          <n-form-item label="招商项目" path="accountResourceName">
            <n-input v-model:value="formParams.accountResourceName" readonly />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="租售类型" path="rentType">
            <n-radio-group v-model:value="formParams.rentType">
              <n-space>
                <n-radio value="租赁">租赁</n-radio>
                <n-radio value="销售">销售</n-radio>
              </n-space>
            </n-radio-group>
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="客户来源" path="customerSource">
            <n-select
              v-model:value="formParams.customerSource"
              label-field="label"
              value-field="label"
              :options="customerSourceOptions"
              placeholder="请选择"
            />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="客户名称" path="customerName">
            <n-input v-model:value="formParams.customerName" />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="省市区" path="">
            <n-input />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="组织机构代码" path="organizationCode">
            <n-input v-model:value="formParams.organizationCode" />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="注册地址" path="registerAddress">
            <n-input v-model:value="formParams.registerAddress" />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="注册时间" path="">
            <n-date-picker type="datetime" clearable />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="注册资本" path="registerCapital">
            <n-input v-model:value="formParams.registerCapital">
              <template #suffix>万元</template>
            </n-input>
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="联系人" path="contactName">
            <n-input v-model:value="formParams.contactName" />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="联系人职务" path="contactPosition">
            <n-select
              v-model:value="formParams.contactPosition"
              label-field="label"
              value-field="label"
              :options="contactPositionOptions"
              placeholder="请选择"
            />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="联系电话" path="contactPhone">
            <n-input v-model:value="formParams.contactPhone" />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="所属行业" path="industry">
            <n-select
              v-model:value="formParams.industry"
              label-field="label"
              value-field="label"
              :options="industryOptions"
              placeholder="请选择"
            />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="主营产品" path="mainProduct">
            <n-input v-model:value="formParams.mainProduct" />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="关联企业" path="relaEnterprises">
            <n-select
              v-model:value="formParams.relaEnterprises"
              label-field="label"
              value-field="label"
              :options="relaEnterprisesOptions"
              placeholder="请选择"
            />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="现有场地情况" path="spaceCondition">
            <n-input-group>
              <n-select
                v-model:value="spaceConditionType"
                style="width: 150px"
                :options="spaceConditionOptions"
              />
              <n-input v-model="formParams.spaceCondition" placeholder="保留两位小数"
                ><template #suffix> 平米 </template></n-input
              >
            </n-input-group>
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="需求业态" path="unitType">
            <n-radio-group v-model:value="formParams.unitType">
              <n-space>
                <n-radio value="独栋">独栋</n-radio>
                <n-radio value="分层">分层</n-radio>
              </n-space>
            </n-radio-group>
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="需求面积" path="requireArea">
            <n-input v-model:value="formParams.requireArea" placeholder="保留两位小数">
              <template #suffix> 平米 </template>
            </n-input>
          </n-form-item>
        </n-gi>
      </n-grid>
    </n-form>

    <template #action>
      <n-space>
        <n-button type="info" :loading="isConfirming" @click="handleConfirmClick">确定</n-button>
        <n-button @click="modalVisible = false">取消</n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
  import { reactive, ref, unref, defineExpose, defineEmits, handleError } from 'vue';
  import { FormRules } from 'naive-ui';
  //   import { PWD_REGEXP } from '@/enums/validatorEnum';
  //   import { getRoleList } from '@/api/role';
  import { AddConsumerReq } from '@/api/model/consumer';
  import { add } from '@/api/consumer';

  const spaceConditionOptions = [
    {
      label: '租赁',
    },
    {
      label: '自有',
    },
  ];

  const contactPositionOptions = [
    {
      label: '老板',
    },
    {
      label: '法人',
    },
    {
      label: '股东',
    },
    {
      label: '高管',
    },
  ];

  const industryOptions = [
    {
      label: '新一代信息技术',
    },
    {
      label: '高端装备',
    },
    {
      label: '新材料',
    },
    {
      label: '生物产业',
    },
    {
      label: '汽车零部件',
    },
    {
      label: '新能源产业',
    },
    {
      label: '节能环保',
    },
    {
      label: '数字创意',
    },
    {
      label: '相关服务业',
    },
    {
      label: '其他',
    },
  ];

  const relaEnterprisesOptions = [
    {
      label: '1家',
    },
    {
      label: '2家',
    },
    {
      label: '3家',
    },
    {
      label: '3家以上',
    },
  ];

  const formRef = ref();
  const customerSourceOptions = [
    {
      label: '电开',
    },
    {
      label: '邮件',
    },
    {
      label: '短信',
    },
    {
      label: '陌拜',
    },
    {
      label: '访客',
    },
    {
      label: '渠道',
    },
  ];

  const spaceConditionType = ref('租赁');

  const defaultParams = () => ({
    accountResourceId: '',
    accountResourceName: '',
    areaId: '',
    areaName: '',
    cityId: '',
    cityName: '',
    contactName: '',
    contactPhone: '',
    contactPosition: '',
    customerName: '',
    customerSource: '',
    industry: '',
    mainProduct: '',
    organizationCode: '',
    registerAddress: '',
    registerCapital: '',
    relaEnterprises: '',
    rentType: '',
    requireArea: '',
    spaceCondition: '',
    unitType: '',
  });
  let formParams = reactive<AddConsumerReq>(defaultParams());

  const isConfirming = ref(false);
  const emit = defineEmits(['ok']);
  const rules = reactive<FormRules>({
    rentType: { required: true, trigger: ['blur', 'input'], message: '请选择租售类型' },
    customerSource: { required: true, trigger: ['blur', 'input'], message: '请选择客户来源' },
    customerName: { required: true, trigger: ['blur', 'input'], message: '请输入客户名称' },
    organizationCode: { required: true, trigger: ['blur', 'input'], message: '请输入组织机构代码' },
    registerAddress: { required: true, trigger: ['blur', 'input'], message: '请输入注册地址' },
    registerCapital: { required: true, trigger: ['blur', 'input'], message: '请输入注册资本' },
    contactName: { required: true, trigger: ['blur', 'input'], message: '请输入联系人' },
    contactPhone: { required: true, trigger: ['blur', 'input'], message: '请输入联系人电话' },
    mainProduct: { required: true, trigger: ['blur', 'input'], message: '请输入主营产品' },
    requireArea: { required: true, trigger: ['blur', 'input'], message: '请输入需求面积' },
    spaceCondition: { required: true, trigger: ['blur', 'input'], message: '请输入现有场地面积' },
    contactPosition: { required: true, trigger: ['blur', 'input'], message: '请选择联系人职务' },
    industry: { required: true, trigger: ['blur', 'input'], message: '请选择所属行业' },
    relaEnterprises: { required: true, trigger: ['blur', 'input'], message: '请选择关联企业数量' },
    unitType: { required: true, trigger: ['blur', 'input'], message: '请选择需求业态' },
  });

  const handleConfirmClick = () => {
    formRef.value?.validate((errors) => {
      if (errors) {
        return;
      }
      isConfirming.value = true;
      add(formParams)
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

  const show = async (id) => {
    console.log(id);

    formRef.value?.restoreValidation();
    modalVisible.value = true;
    formParams = Object.assign(unref(formParams), defaultParams());
  };

  defineExpose({
    show,
  });
</script>

<style></style>

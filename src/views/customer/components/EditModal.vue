<template>
  <n-modal
    v-model:show="modalVisible"
    preset="dialog"
    :title="customerId ? '编辑客户' : '添加客户'"
    :mask-closable="false"
    style="width: 1000px"
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
          <n-form-item label="招商项目" path="accountResourceId">
            <n-select
              v-model:value="formParams.accountResourceId"
              label-field="resourceName"
              value-field="resourceId"
              :options="projectList"
              :on-update:value="handleProjectChange"
              :disabled="Boolean(customerId)"
              placeholder="请选择"
            />
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
              :disabled="Boolean(customerId)"
              :options="customerSourceOptions"
              placeholder="请选择"
            />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="客户名称" path="customerName">
            <n-input v-model:value="formParams.customerName" :disabled="Boolean(customerId)" />
          </n-form-item>
        </n-gi>
        <n-gi v-show="!customerId">
          <n-form-item label="客户所在地" path="areaId">
            <n-cascader
              remote
              check-strategy="child"
              v-model:value="formParams.areaId"
              :options="addrOptions"
              :on-load="handleAreaLoad"
              :on-update:value="handleAreaIdChange"
            />
          </n-form-item>
        </n-gi>
        <n-gi v-show="Boolean(customerId)">
          <n-form-item label="客户所在地" path="mergerName">
            <n-input v-model:value="formParams.mergerName" :disabled="Boolean(customerId)" />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="组织机构代码" path="organizationCode">
            <n-input v-model:value="formParams.organizationCode" :disabled="Boolean(customerId)" />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="注册地址" path="registerAddress">
            <n-input v-model:value="formParams.registerAddress" :disabled="Boolean(customerId)" />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="注册时间" path="registerTime">
            <n-date-picker
              v-model:value="formParams.registerTime"
              type="date"
              clearable
              :disabled="Boolean(customerId)"
            />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="注册资本" path="registerCapital">
            <n-input v-model:value="formParams.registerCapital" :disabled="Boolean(customerId)">
              <template #suffix>万元</template>
            </n-input>
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="联系人" path="contactName">
            <n-input v-model:value="formParams.contactName" :disabled="Boolean(customerId)" />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="联系人职务" path="contactPosition">
            <n-select
              v-model:value="formParams.contactPosition"
              label-field="label"
              value-field="label"
              :options="contactPositionOptions"
              :disabled="Boolean(customerId)"
              placeholder="请选择"
            />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="联系电话" path="contactPhone">
            <n-input v-model:value="formParams.contactPhone" :disabled="Boolean(customerId)" />
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
              :disabled="Boolean(customerId)"
              placeholder="请选择"
            />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="现有场地" path="spaceCondition">
            <n-input-group>
              <n-select
                v-model:value="spaceConditionType"
                style="width: 128px"
                :options="spaceConditionOptions"
              />
              <n-input v-model:value="formParams.spaceCondition" placeholder=""
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
            <n-input v-model:value="formParams.requireArea" placeholder="">
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
  import { reactive, ref, unref, defineExpose, defineEmits } from 'vue';
  import { FormRules, FormItemRule } from 'naive-ui';
  import {
    spaceConditionOptions,
    contactPositionOptions,
    industryOptions,
    relaEnterprisesOptions,
    customerSourceOptions,
  } from '@/enums/customerEnum';
  import { MOBILE_REGEXP, POSITIVE_INT_REGEXP } from '@/enums/validatorEnum';
  import { useUserStore } from '@/store/modules/user';
  import { CascaderOption } from 'naive-ui';
  import { add, getDetail, update } from '@/api/customer';
  import * as provinceApi from '@/api/province';

  const addrOptions = ref([]);
  provinceApi.getProvinceList().then((res) => {
    addrOptions.value = res.map((item) => {
      return {
        label: item.shortName,
        value: item.id + '',
        areaCode: item.areaCode,
        depth: 1,
        isLeaf: false,
      };
    });
  });

  function handleAreaLoad(option: CascaderOption) {
    return provinceApi.getAreaList(option.areaCode).then((res) => {
      option.children = res.map((item) => {
        return {
          label: item.shortName,
          value: item.id + '',
          areaCode: item.areaCode,
          depth: (option as { depth: number }).depth + 1,
          isLeaf: option.depth === 2,
        };
      });
    });
  }

  const spaceConditionType = ref('租赁');

  const defaultParams = () => ({
    accountResourceId: '',
    accountResourceName: '',
    areaId: '',
    areaName: '',
    contactName: '',
    contactPhone: '',
    contactPosition: '',
    customerName: '',
    customerSource: undefined,
    industry: '',
    mainProduct: '',
    mergerName: '',
    organizationCode: '',
    registerAddress: '',
    registerCapital: '',
    registerTime: undefined,
    relaEnterprises: '',
    rentType: '',
    requireArea: '',
    spaceCondition: '',
    unitType: '',
  });
  let formParams = reactive(defaultParams());

  const handleAreaIdChange = (value, option, pathValues) => {
    formParams.areaName = option.label;
    let mergerName = '';
    pathValues.forEach((element, index) => {
      mergerName += element.label;
      if (index !== pathValues.length - 1) {
        mergerName += ' / ';
      }
    });
    formParams.mergerName = mergerName;
    formParams.areaId = value + '';
  };

  const handleProjectChange = (value, option) => {
    formParams.accountResourceId = value;
    formParams.accountResourceName = option.resourceName;
  };

  const isConfirming = ref(false);
  const emit = defineEmits(['ok']);
  const rules = reactive<FormRules>({
    accountResourceId: { required: true, trigger: ['blur', 'input'], message: '请选择招商项目' },
    areaId: { required: true, trigger: ['change'], message: '请选择客户所在省市区' },
    rentType: { required: true, trigger: ['blur', 'input'], message: '请选择租售类型' },
    customerSource: { required: true, trigger: ['blur', 'input'], message: '请选择客户来源' },
    customerName: { required: true, trigger: ['blur', 'input'], message: '请输入客户名称' },
    organizationCode: { required: true, trigger: ['blur', 'input'], message: '请输入组织机构代码' },
    registerAddress: { required: true, trigger: ['blur', 'input'], message: '请输入注册地址' },
    registerCapital: [
      {
        required: true,
        trigger: ['blur', 'input'],
        validator(rule: FormItemRule, value: string) {
          if (!value) {
            return new Error('请输入注册资本');
          } else {
            if (!POSITIVE_INT_REGEXP.test(value)) {
              return new Error('只能输入正整数');
            }
          }
        },
      },
    ],
    registerTime: { required: true, type: 'integer', trigger: 'change', message: '请输入注册时间' },
    contactName: { required: true, trigger: ['blur', 'input'], message: '请输入联系人' },
    contactPhone: [
      { required: true, trigger: ['blur', 'input'], message: '请输入联系人电话' },
      { pattern: MOBILE_REGEXP, trigger: ['blur', 'input'], message: '手机号格式错误' },
    ],
    mainProduct: { required: true, trigger: ['blur', 'input'], message: '请输入主营产品' },
    requireArea: {
      required: true,
      trigger: ['blur', 'input'],
      validator(rule: FormItemRule, value: string) {
        if (!value) {
          return new Error('请输入需求面积');
        } else {
          if (!POSITIVE_INT_REGEXP.test(value)) {
            return new Error('只能输入正整数');
          }
        }
      },
    },
    spaceCondition: {
      required: true,
      trigger: ['blur', 'input'],
      validator(rule: FormItemRule, value: string) {
        if (!value) {
          return new Error('请输入现有场地面积');
        } else {
          if (!POSITIVE_INT_REGEXP.test(value)) {
            return new Error('只能输入正整数');
          }
        }
      },
    },
    contactPosition: { required: true, trigger: ['blur', 'input'], message: '请选择联系人职务' },
    industry: { required: true, trigger: ['blur', 'input'], message: '请选择所属行业' },
    relaEnterprises: { required: true, trigger: ['blur', 'input'], message: '请选择关联企业数量' },
    unitType: { required: true, trigger: ['blur', 'input'], message: '请选择需求业态' },
  });

  const modalVisible = ref(false);
  const projectList = ref([]);
  const customerId = ref('');
  const show = async (id) => {
    modalVisible.value = true;
    formRef.value?.restoreValidation();
    const userStore = useUserStore();
    const { resourceDTOList } = userStore?.info || {};
    projectList.value = resourceDTOList;
    if (id) {
      customerId.value = id;
      getDetail(id).then((res) => {
        Object.assign(unref(formParams), res.baseInfoDTO);
        formParams.areaId = '1';
      });
    } else {
      customerId.value = '';
      formParams = Object.assign(unref(formParams), defaultParams());
    }
  };

  const formRef = ref();
  const handleConfirmClick = () => {
    formRef.value?.validate((errors) => {
      if (errors) {
        return;
      }
      isConfirming.value = true;
      if (!customerId.value) {
        add(formParams)
          .then(() => {
            modalVisible.value = false;
            emit('ok');
          })
          .finally(() => {
            isConfirming.value = false;
          });
      } else {
        const params = {
          customerId: customerId.value,
          industry: formParams.industry,
          mainProduct: formParams.mainProduct,
          rentType: formParams.rentType,
          requireArea: formParams.requireArea,
          spaceCondition: formParams.spaceCondition,
          unitType: formParams.unitType,
        };

        update(params)
          .then(() => {
            modalVisible.value = false;
            emit('ok');
          })
          .finally(() => {
            isConfirming.value = false;
          });
      }
    });
  };

  defineExpose({
    show,
  });
</script>

<style></style>

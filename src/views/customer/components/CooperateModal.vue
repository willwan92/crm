<template>
  <n-modal
    v-model:show="modalVisible"
    preset="dialog"
    title="客户合作"
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
      <n-form-item label="合作项目" path="accountResourceId">
        <n-cascader
          remote
          check-strategy="child"
          v-model:value="formParams.accountResourceId"
          :loading="areaLoading"
          :options="areas"
          :show-path="false"
          :on-update:value="handleProjectChange"
        />
      </n-form-item>
      <n-form-item label="合作人员" path="cooperateAccountId">
        <n-select
          v-model:value="formParams.cooperateAccountId"
          label-field="label"
          value-field="value"
          :options="cooperateAccountOptions"
          :on-update:value="handleCooperateAccountChange"
          placeholder="请选择"
        />
      </n-form-item>
      <n-form-item label="我的业绩分成" path="currentAccountProjectDivision">
        <n-select
          v-model:value="formParams.currentAccountProjectDivision"
          label-field="label"
          value-field="label"
          :options="projectDivisionOptions"
          placeholder="请选择"
        />
      </n-form-item>
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
  import { reactive, ref, unref, defineExpose } from 'vue';
  import { FormRules } from 'naive-ui';
  import { getResourceList } from '@/api/project';
  import { getProjectAccountList, cooperate } from '@/api/cooperate';
  import { useMessage } from 'naive-ui';

  const message = useMessage();

  const formRef = ref();

  const projectDivisionOptions = [
    {
      label: '10%',
    },
    {
      label: '20%',
    },
    {
      label: '30%',
    },
    {
      label: '40%',
    },
    {
      label: '50%',
    },
    {
      label: '60%',
    },
    {
      label: '70%',
    },
    {
      label: '80%',
    },
    {
      label: '90%',
    },
  ];

  interface cascaderOptions {
    value: string;
    label: string;
    depth: number;
    isLeaf: boolean;
    children?: any[];
  }

  const areas = ref<cascaderOptions[]>([]);
  const loadCascsderChildren = async (option) => {
    const resourceTypes = [
      {
        type: 'CITY',
        pid: 'areaId',
      },
      {
        type: 'PROJECT',
        pid: 'cityId',
      },
    ];
    const resourceType = resourceTypes[option.depth].type;
    const params = {
      resourceType,
      size: 9999,
      current: 1,
    };
    params[resourceTypes[option.depth].pid] = option.value;
    const { records } = await getResourceList(params);
    const children: cascaderOptions[] = [];
    Array.isArray(records) &&
      records.forEach((item) => {
        const tmp = {
          value: item.resourceId,
          label: item.resourceName,
          depth: option.depth + 1,
          isLeaf: option.depth === 1,
        };
        children.push(tmp);
        if (!tmp.isLeaf) {
          loadCascsderChildren(tmp);
        }
      });
    option.children = children;
  };

  const areaLoading = ref(false);
  const getAreaList = () => {
    areaLoading.value = true;
    getResourceList({
      resourceType: 'AREA',
      size: 9999,
      current: 1,
    })
      .then((res) => {
        areas.value = res.records.map((item) => {
          const area = {
            value: item.resourceId,
            label: item.resourceName,
            depth: 0,
            isLeaf: false,
          };
          loadCascsderChildren(area);
          return area;
        });
      })
      .finally(() => {
        areaLoading.value = false;
      });
  };
  getAreaList();

  const cooperateAccountOptions = ref();

  const customerName = ref('');
  const defaultParams = () => ({
    accountResourceId: '',
    accountResourceName: '',
    cooperateAccountId: '',
    cooperateAccountName: '',
    currentAccountProjectDivision: '50%',
    customerId: '',
  });
  let formParams = reactive(defaultParams());

  const handleProjectChange = (value, option) => {
    formParams.accountResourceId = value;
    formParams.accountResourceName = option.label;
    formParams.cooperateAccountId = '';
    getProjectAccountList(value).then((data) => {
      cooperateAccountOptions.value = Array.isArray(data)
        ? data.map((item) => ({
            label: item.accountName,
            value: item.accountId,
          }))
        : [];
    });
  };

  const handleCooperateAccountChange = (value, option) => {
    formParams.cooperateAccountId = value;
    formParams.cooperateAccountName = option.label;
  };

  const isConfirming = ref(false);
  const rules = reactive<FormRules>({
    accountResourceId: [
      {
        required: true,
        trigger: ['change'],
        message: '请选择合作项目',
      },
    ],
    cooperateAccountId: [
      {
        required: true,
        trigger: ['change'],
        message: '请选择合作人员',
      },
    ],
    currentAccountProjectDivision: [
      {
        required: true,
        trigger: ['change'],
        message: '请选择业绩分成',
      },
    ],
  });

  const emit = defineEmits(['ok']);
  const handleConfirmClick = () => {
    formRef.value?.validate((errors) => {
      if (errors) {
        return;
      }
      isConfirming.value = true;

      cooperate(formParams)
        .then(() => {
          message.success(`客户 ${customerName.value} 合作成功`);
          emit('ok');
          modalVisible.value = false;
        })
        .finally(() => {
          isConfirming.value = false;
        });
    });
  };

  const modalVisible = ref(false);
  const show = async (row) => {
    customerName.value = row.customerName;
    formParams = Object.assign(unref(formParams), defaultParams());
    formParams.customerId = row.id;

    formRef.value?.restoreValidation();
    modalVisible.value = true;
  };

  defineExpose({
    show,
  });
</script>

<style></style>

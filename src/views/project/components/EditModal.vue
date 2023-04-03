<template>
  <n-modal v-model:show="modalVisible" preset="dialog" title="添加项目" :mask-closable="false" style="width: 600px">
    <n-form ref="formRef" :model="formParams" :rules="rules" label-placement="left" label-align="right" label-width="auto"
      size="medium" require-mark-placement="right-hanging" style="margin: 30px 30px 0">
      <n-form-item label="所属区域" path="areaId">
        <n-select v-model:value="formParams.areaId" @update:value="handleAreaUpdate" :options="areaOptions"
          label-field="label" value-field="value" />
      </n-form-item>
      <n-form-item label="所属城市" path="pid">
        <n-select v-model:value="formParams.pid" label-field="label" value-field="value" :options="cityOptions" />
      </n-form-item>
      <n-form-item label="项目名称" path="resourceName">
        <n-input v-model:value="formParams.resourceName" placeholder="" />
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
import { reactive, ref, unref, defineExpose, defineEmits } from 'vue';
import { FormRules, FormItemRule } from 'naive-ui';
import { getResourceList, addResource } from '@/api/project';

const formRef = ref();
const areaOptions = ref([]);
const cityOptions = ref([]);

const defaultParams = () => ({
  areaId: '',
  pid: '',
  resourceName: '',
  resourceType: 'PROJECT',
});

let formParams = reactive(defaultParams());

getResourceList({
  resourceType: 'AREA',
  size: 9999,
  current: 1,
}).then(res => {
  areaOptions.value = res.records.map(item => ({
    value: item.resourceId,
    label: item.resourceName
  }));
})

const handleAreaUpdate = (value: string) => {
  formParams.pid = '';
  getResourceList({
    areaId: value,
    resourceType: 'CITY',
    size: 9999,
    current: 1,
  }).then(res => {
    cityOptions.value = res.records.map(item => ({
      value: item.resourceId,
      label: item.resourceName
    }));
  })
}

const isConfirming = ref(false);
const emit = defineEmits(['ok']);
const rules: FormRules = {
  resourceName: { required: true, trigger: ['blur'], message: '请输入项目名称' },
  areaId: { required: true, trigger: ['blur'], message: '请选择区域' },
  pid: { required: true, trigger: ['blur'], message: '请选择城市' },
};

const handleConfirmClick = () => {
  formRef.value?.validate((errors) => {
    if (errors) {
      return;
    }
    isConfirming.value = true;
    addResource(formParams)
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
const show = () => {
  getResourceList({
    resourceType: 'AREA',
    size: 9999,
    current: 1,
  }).then(res => {
    areaOptions.value = res.records.map(item => ({
      value: item.resourceId,
      label: item.resourceName
    }));
  })

  formParams = Object.assign(unref(formParams), defaultParams());
  formRef.value?.restoreValidation();
  modalVisible.value = true;
};

defineExpose({
  show,
});
</script>

<style></style>

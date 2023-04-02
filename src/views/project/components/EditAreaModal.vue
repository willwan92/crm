<template>
  <n-modal v-model:show="modalVisible" preset="dialog" title="添加区域" :mask-closable="false" style="width: 600px">
    <n-form ref="formRef" :model="formParams" :rules="rules" label-placement="left" label-align="right" label-width="auto"
      size="medium" require-mark-placement="right-hanging" style="margin: 30px 30px 0">
      <n-form-item label="区域名称" path="resourceName">
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
import { addResource } from '@/api/project';

const formRef = ref();

const defaultParams = () => ({
  resourceName: '',
  resourceType: 'AREA',
});

let formParams = reactive(defaultParams());

const isConfirming = ref(false);
const emit = defineEmits(['ok']);
const rules: FormRules = {
  resourceName: { required: true, trigger: ['blur'], message: '请输入区域名称' },
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
  formParams = Object.assign(unref(formParams), defaultParams());
  formRef.value?.restoreValidation();
  modalVisible.value = true;
};

defineExpose({
  show,
});
</script>

<style></style>

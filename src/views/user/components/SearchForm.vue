<template>
  <n-form
    ref="searchRef"
    :model="searchParams"
    inline
    label-placement="left"
    label-width="auto"
    require-mark-placement="right-hanging"
  >
    <n-form-item label="用户名" path="keyName">
      <n-input v-model:value="searchParams.keyName" placeholder="支持用户姓名和登录名" />
    </n-form-item>
    <n-form-item label="状态" path="status">
      <n-select
        v-model:value="searchParams.status"
        label-field="label"
        value-field="value"
        :options="statusOptions"
        style="width: 120px"
      />
    </n-form-item>
    <n-space>
      <n-button type="info" @click="emitReloadTable"> 查询 </n-button>
      <n-button @click="resetParams">重置 </n-button>
    </n-space>
  </n-form>
</template>

<script lang="ts" setup>
import { ref, reactive, defineEmits, defineExpose } from 'vue';
import { QueryUserReq } from '@/api/models/user';

const statusOptions = [
  {
    value: '',
    label: '全部',
  },
  {
    value: 0,
    label: '启用',
  },
  {
    value: 1,
    label: '禁用',
  },
];

const searchParams = reactive<QueryUserReq>({
  keyName: '',
  status: '',
});

defineExpose({
  searchParams,
});

function resetParams() {
  searchParams.keyName = '';
  searchParams.status = 0;
  emitReloadTable();
}

const emit = defineEmits(['reloadTable']);
const emitReloadTable = () => {
  emit('reloadTable');
};
</script>

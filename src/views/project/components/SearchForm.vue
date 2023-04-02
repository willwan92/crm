<template>
  <n-form ref="searchRef" :model="searchParams" inline label-placement="left" label-width="auto"
    require-mark-placement="right-hanging">
    <n-form-item label="区域" path="areaId">
      <n-select v-model:value="searchParams.areaId" label-field="label" @update:value="handleAreaUpdate"
        value-field="value" :options="[{
          value: '',
          label: '全部'
        }, ...areaOptions]" style="width: 120px" placeholder="全部" />
    </n-form-item>

    <n-form-item label="城市" path="cityId">
      <n-select v-model:value="searchParams.cityId" label-field="label" value-field="value" :options="[{
        value: '',
        label: '全部'
      }, ...cityOptions]" style="width: 120px" placeholder="全部" />
    </n-form-item>
    <n-space>
      <n-button type="info" @click="emitReloadTable"> 查询 </n-button>
      <n-button @click="resetParams">重置 </n-button>
    </n-space>
  </n-form>
</template>

<script lang="ts" setup>
import { unref, ref, reactive, defineEmits, defineExpose, h, VNodeChild } from 'vue';
import { PlusOutlined, CloseOutlined } from '@vicons/antd';
import { NIcon, SelectOption } from 'naive-ui';
import { getResourceList } from '@/api/project';

const areaOptions = ref([]);
const cityOptions = ref([]);


const defaultParams = () => ({
  areaId: '',
  cityId: '',
});

let searchParams = reactive(defaultParams());

getResourceList({
  resourceType: 'AREA',
  pageSize: 9999,
  pageNum: 1,
}).then(res => {
  areaOptions.value = res.records.map(item => ({
    value: item.resourceId,
    label: item.resourceName
  }));
})

const handleAreaUpdate = (value: string) => {
  searchParams.cityId = '';
  getResourceList({
    areaId: value,
    resourceType: 'CITY',
    pageSize: 9999,
    pageNum: 1,
  }).then(res => {
    cityOptions.value = res.records.map(item => ({
      value: item.resourceId,
      label: item.resourceName
    }));
  })
}

defineExpose({
  searchParams,
});

function resetParams() {
  searchParams = Object.assign(unref(searchParams), defaultParams());
  emitReloadTable();
}

const emit = defineEmits(['reloadTable']);
const emitReloadTable = () => {
  emit('reloadTable');
};
</script>

<style scoped lang="less">
.icon-plus {
  font-size: 20px;
  color: #ccc;
  cursor: pointer;
  margin-left: 5px;

  &:hover {
    color: #2080f0;
  }
}
</style>

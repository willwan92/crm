<template>
  <n-form
    :model="searchParams"
    inline
    label-placement="left"
    label-width="auto"
    require-mark-placement="right-hanging"
  >
    <n-form-item label="客户所在地区" path="parentIdList">
      <n-cascader
        remote
        clearable
        multiple
        :max-tag-count="1"
        check-strategy="parent"
        v-model:value="searchParams.parentIdList"
        style="width: 300px"
        :options="addrOptions"
        :on-load="handleAreaLoad"
        :on-update:value="handleAreaIdListUpdate"
      />
    </n-form-item>
    <n-form-item label="所属行业" path="industry">
      <n-select
        v-model:value="searchParams.industry"
        label-field="label"
        value-field="label"
        style="width: 150px"
        clearable
        :options="industryOptions"
      />
    </n-form-item>
    <n-form-item label="掉公海时间" path="timerange">
      <n-date-picker v-model:value="searchParams.timerange" type="datetimerange" clearable />
    </n-form-item>
    <n-space>
      <n-button type="info" @click="emitReloadTable"> 查询 </n-button>
      <n-button @click="resetParams">重置 </n-button>
    </n-space>
  </n-form>
</template>

<script lang="ts" setup>
  import * as provinceApi from '@/api/province';
  import { CascaderOption } from 'naive-ui';
  import { industryOptions } from '@/enums/customerEnum';
  import { unref, reactive, ref } from 'vue';

  const addrOptions = ref([]);
  provinceApi.getProvinceList().then((res) => {
    addrOptions.value = res.map((item) => {
      return {
        label: item.name,
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
          label: item.name,
          value: item.id + '',
          areaCode: item.areaCode,
          depth: (option as { depth: number }).depth + 1,
          isLeaf: option.depth === 2,
        };
      });
    });
  }

  interface Req {
    parentIdList: string[];
    areaIdList: string[];
    industry: string;
    timerange: [number, number] | null;
  }

  const defaultParams = (): Req => ({
    parentIdList: [],
    areaIdList: [],
    industry: '',
    timerange: null,
  });

  let searchParams = reactive<Req>(defaultParams());

  const handleAreaIdListUpdate = (value, option) => {
    searchParams.parentIdList = value;
    let idList: string[] = [];
    const getAreaIdList = (option) => {
      option.forEach((item) => {
        if (item.children) {
          getAreaIdList(item.children);
        } else {
          idList.push(item.value);
        }
      });
    };
    getAreaIdList(option);
    searchParams.areaIdList = idList;
  };

  function resetParams() {
    searchParams = Object.assign(unref(searchParams), defaultParams());
    emitReloadTable();
  }

  const emit = defineEmits(['reloadTable']);
  const emitReloadTable = () => {
    emit('reloadTable');
  };

  defineExpose({
    searchParams,
  });
</script>

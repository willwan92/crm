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
        clearable
        :options="statusOptions"
        style="width: 120px"
        placeholder="全部"
      />
    </n-form-item>
    <n-form-item label="所属项目" path="areaId">
      <n-cascader
        remote
        clearable
        check-strategy="child"
        v-model:value="searchParams.projectId"
        style="width: 200px"
        :options="projectOptions"
        :on-load="handleProjectLoad"
      />
    </n-form-item>
    <n-space>
      <n-button type="info" @click="emitReloadTable"> 查询 </n-button>
      <n-button @click="resetParams">重置 </n-button>
    </n-space>
  </n-form>
</template>

<script lang="ts" setup>
  import { CascaderOption } from 'naive-ui';
  import { ref, unref, reactive, defineExpose } from 'vue';
  import { getResourceList } from '@/api/project';

  const statusOptions = [
    {
      value: 0,
      label: '启用',
    },
    {
      value: 1,
      label: '禁用',
    },
  ];

  const projectOptions = ref([]);
  getResourceList({
    resourceType: 'AREA',
    size: 9999,
    current: 1,
  }).then((res) => {
    projectOptions.value = res.records.map((item) => {
      const area = {
        value: item.resourceId,
        label: item.resourceName,
        depth: 0,
        isLeaf: false,
      };
      return area;
    });
  });

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
  function handleProjectLoad(option: CascaderOption) {
    const resourceType = resourceTypes[(option as { depth: number }).depth].type;
    const params = {
      resourceType,
      size: 9999,
      current: 1,
    };
    params[resourceTypes[(option as { depth: number }).depth].pid] = option.value;
    return getResourceList(params).then((res) => {
      option.children = res.records.map((item) => {
        return {
          label: item.resourceName,
          value: item.resourceId + '',
          depth: (option as { depth: number }).depth + 1,
          isLeaf: option.depth === 1,
        };
      });
    });
  }

  const defaultParams = () => ({
    keyName: '',
    projectId: '',
    status: null,
  });

  let searchParams = reactive(defaultParams());

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

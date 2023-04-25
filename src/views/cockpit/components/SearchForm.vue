<template>
  <n-form
    :model="searchParams"
    inline
    label-placement="left"
    label-width="auto"
    require-mark-placement="right-hanging"
  >
    <n-form-item label="所属城市" path="cityId">
      <n-select
        v-model:value="searchParams.cityId"
        style="width: 150px"
        clearable
        :options="cities"
      />
    </n-form-item>
    <n-form-item label="所属项目" path="projectId">
      <n-select
        v-model:value="searchParams.projectId"
        style="width: 150px"
        clearable
        :options="projects"
      />
    </n-form-item>
    <n-form-item label="招商角色" path="positionCode">
      <n-select
        v-model:value="searchParams.positionCode"
        label-field="positionName"
        value-field="positionCode"
        style="width: 150px"
        clearable
        :options="accoutPositionOptions"
      />
    </n-form-item>
    <n-form-item label="客户等级" path="customerLevel">
      <n-select
        v-model:value="searchParams.customerLevel"
        label-field="label"
        value-field="label"
        clearable
        :options="levelOptions"
        style="width: 120px"
        placeholder="全部"
      />
    </n-form-item>
    <n-form-item label="时间范围" path="timerange">
      <n-date-picker v-model:value="searchParams.timerange" type="datetimerange" />
    </n-form-item>
    <n-space>
      <n-button type="info" @click="emitReloadTable"> 查询 </n-button>
      <n-button @click="resetParams">重置 </n-button>
    </n-space>
  </n-form>
</template>

<script lang="ts" setup>
  import { getPositionList } from '@/api/role';
  import { getResourceList } from '@/api/project';
  import { unref, reactive, ref, defineExpose } from 'vue';

  const levelOptions = [
    {
      value: 0,
      label: 'D',
    },
    {
      value: 1,
      label: 'C',
    },
    {
      value: 2,
      label: 'B',
    },
    {
      value: 3,
      label: 'A',
    },
    {
      value: 4,
      label: 'O',
    },
  ];

  interface positionOption {
    id: number;
    positionName: string;
    roleId: string;
    roleName: string;
  }
  const accoutPositionOptions = ref<positionOption[]>([]);
  getPositionList().then((res) => {
    accoutPositionOptions.value = res.filter((item) => {
      // 普通用户和中层管理
      return ['400', '300'].includes(item.roleId);
    });
  });

  const cities = ref([]);
  const getCityList = () => {
    getResourceList({
      resourceType: 'CITY',
      size: 9999,
      current: 1,
    }).then((res) => {
      cities.value = res.records.map((city) => ({
        value: city.resourceId,
        label: city.resourceName,
      }));
    });
  };
  getCityList();

  const projects = ref([]);
  const getProjects = () => {
    getResourceList({
      resourceType: 'PROJECT',
      size: 9999999,
      current: 1,
    }).then((res) => {
      projects.value = res.records.map((city) => ({
        value: city.resourceId,
        label: city.resourceName,
      }));
    });
  };
  getProjects();

  const defaultParams = () => ({
    cityId: undefined,
    projectId: undefined,
    positionCode: undefined,
    customerLevel: undefined,
    timerange: [Date.now() - 86400000 * 7, Date.now()],
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
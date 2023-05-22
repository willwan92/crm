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
        style="width: 80px"
        clearable
        :options="cities"
      />
    </n-form-item>
    <n-form-item label="所属项目" path="projectId">
      <n-select
        v-model:value="searchParams.projectId"
        style="width: 100px"
        clearable
        :options="projects"
      />
    </n-form-item>
    <n-form-item label="招商人员" path="nameKeyword">
      <n-input v-model:value="searchParams.nameKeyword" style="width: 80px" />
    </n-form-item>
    <n-form-item label="招商角色" path="positionCode">
      <n-select
        v-model:value="searchParams.positionCode"
        label-field="positionName"
        value-field="positionCode"
        style="width: 100px"
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
        style="width: 70px"
        placeholder="全部"
      />
    </n-form-item>
    <n-form-item label="时间范围" path="timerange">
      <n-date-picker
        v-model:value="searchParams.timerange"
        type="datetimerange"
        style="width: 350px"
      />
    </n-form-item>
    <n-space>
      <n-button type="info" @click="emitReloadTable"> 查询 </n-button>
      <n-button @click="resetParams">重置 </n-button>
    </n-space>
  </n-form>
</template>

<script lang="ts" setup>
  import { getPositionList } from '@/api/role';
  import { getCitiesByCurrentUser, getProjectsByCurrentUser } from '@/api/project';
  import { unref, reactive, ref, defineExpose, watch } from 'vue';
  import { subMonths, startOfDay, endOfDay } from 'date-fns';

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
    getCitiesByCurrentUser().then((res) => {
      cities.value = res.map((city) => ({
        value: city.resourceId,
        label: city.resourceName,
      }));
    });
  };
  getCityList();

  const projects = ref([]);
  const getProjects = (cityId: string) => {
    getProjectsByCurrentUser(cityId).then((res) => {
      projects.value = res.map((city) => ({
        value: city.resourceId,
        label: city.resourceName,
      }));
    });
  };

  const defaultParams = () => ({
    cityId: null,
    projectId: null,
    nameKeyword: '',
    positionCode: null,
    customerLevel: null,
    timerange: [startOfDay(subMonths(Date.now(), 1)).getTime(), endOfDay(Date.now()).getTime()],
  });

  let searchParams = reactive(defaultParams());

  watch(
    () => searchParams.cityId,
    (newVal) => {
      if (newVal) {
        getProjects(newVal);
      } else {
        projects.value = [];
      }
      searchParams.projectId = null;
    }
  );

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

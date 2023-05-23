<template>
  <n-form
    :model="rankingParams"
    :inline="!getIsMobile"
    label-placement="left"
    label-width="auto"
    require-mark-placement="right-hanging"
  >
    <n-form-item label="客户等级" path="customerLevel">
      <n-select
        v-model:value="rankingParams.customerLevel"
        label-field="label"
        value-field="label"
        clearable
        :options="levelOptions"
        style="width: 120px"
        placeholder="全部"
      />
    </n-form-item>
    <n-form-item label="起始时间">
      <n-date-picker v-model:value="rankingParams.timerange[0]" type="datetime" clearable />
    </n-form-item>
    <n-form-item label="截止时间">
      <n-date-picker v-model:value="rankingParams.timerange[1]" type="datetime" clearable />
    </n-form-item>
    <n-space :justify="getIsMobile ? 'end' : 'start'">
      <n-button type="info" @click="emitReloadTable"> 查询 </n-button>
      <n-button @click="resetParams">重置 </n-button>
    </n-space>
  </n-form>
</template>

<script lang="ts" setup>
  import { subMonths, startOfDay, endOfDay } from 'date-fns';
  import { unref, reactive } from 'vue';
  import { useProjectSetting } from '@/hooks/setting/useProjectSetting';

  const { getIsMobile } = useProjectSetting();

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

  const defaultParams = () => ({
    customerLevel: undefined,
    timerange: [startOfDay(subMonths(Date.now(), 1)).getTime(), endOfDay(Date.now()).getTime()],
  });

  let rankingParams = reactive(defaultParams());

  defineExpose({
    rankingParams,
  });

  function resetParams() {
    rankingParams = Object.assign(unref(rankingParams), defaultParams());
    emitReloadTable();
  }

  const emit = defineEmits(['reloadRanking']);
  const emitReloadTable = () => {
    emit('reloadRanking');
  };
</script>

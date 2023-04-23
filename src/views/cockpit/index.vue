<template>
  <n-card title="客户排名" style="margin-bottom: 12px">
    <RankingForm ref="rankingFormRef" @reload-ranking="reloadRanking" />
    <n-grid x-gap="20" :cols="3">
      <n-gi class="ranking-item">
        <div class="title-wrapper">
          <n-button strong secondary type="info" class="title"> 城市排名 </n-button>
        </div>
        <div class="content-wrapper">
          <div v-for="(item, index) in cityData" :key="item.city">
            <span :style="{ color: getColor(index) }">N0.{{ index + 1 }} {{ item.city }}</span>
            <n-progress
              type="line"
              class="progress"
              :percentage="item.percentage"
              :color="getColor(index)"
              rail-color="#fff"
              :indicator-text-color="getColor(index)"
            >
              {{ item.count }} 个
            </n-progress>
          </div>
        </div>
      </n-gi>

      <n-gi class="ranking-item">
        <div class="title-wrapper">
          <n-button strong secondary type="info" class="title"> 项目排名 </n-button>
        </div>
        <div class="content-wrapper">
          <div v-for="(item, index) in cityData" :key="item.city">
            <span :style="{ color: getColor(index) }">N0.{{ index + 1 }} {{ item.city }}</span>
            <n-progress
              type="line"
              class="progress"
              :percentage="item.percentage"
              :color="getColor(index)"
              rail-color="#fff"
              :indicator-text-color="getColor(index)"
            >
              {{ item.count }} 个
            </n-progress>
          </div>
        </div>
      </n-gi>
      <n-gi class="ranking-item">
        <div class="title-wrapper">
          <n-button strong secondary type="info" class="title"> 人员排名 </n-button>
        </div>
        <div class="content-wrapper">
          <div v-for="(item, index) in cityData" :key="item.city">
            <span :style="{ color: getColor(index) }">N0.{{ index + 1 }} {{ item.city }}</span>
            <n-progress
              type="line"
              class="progress"
              :percentage="item.percentage"
              :color="getColor(index)"
              rail-color="#fff"
              :indicator-text-color="getColor(index)"
            >
              {{ item.count }} 个
            </n-progress>
          </div>
        </div>
      </n-gi>
    </n-grid>
  </n-card>
  <n-card title="客户总览" style="margin-bottom: 12px">
    <SearchForm ref="searchFormRef" @reload-table="reloadTable" />
    <BasicTable :toolbarShow="false" :columns="columns" :request="loadDataTable" ref="tableRef" />
  </n-card>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicTable } from '@/components/Table';
  import { formatToDateTime } from '@/utils/dateUtil';
  import { getpublicPoolCustomers } from '@/api/customerPool';
  import SearchForm from './components/SearchForm.vue';
  import RankingForm from './components/RankingForm.vue';

  import { useThemeVars } from 'naive-ui';

  const themeVars = useThemeVars();
  console.log(themeVars.value);

  const colors = ref([
    themeVars.value.errorColor,
    themeVars.value.warningColor,
    themeVars.value.successColor,
    themeVars.value.textColor3,
  ]);

  const getColor = (index) => {
    return index < 3 ? colors.value[index] : colors.value[3];
  };

  const cityData = ref([
    {
      city: '北京',
      count: 90,
      percentage: 90,
    },
    {
      city: '上海',
      count: 78,
      percentage: 78,
    },
    {
      city: '北京',
      count: 60,
      percentage: 60,
    },
    {
      city: '上海',
      count: 58,
      percentage: 58,
    },
    {
      city: '北京',
      count: 50,
      percentage: 50,
    },
    {
      city: '上海',
      count: 28,
      percentage: 28,
    },
    {
      city: '北京',
      count: 35,
      percentage: 35,
    },
    {
      city: '上海',
      count: 13,
      percentage: 13,
    },
    {
      city: '北京',
      count: 11,
      percentage: 11,
    },
    {
      city: '上海',
      count: 8,
      percentage: 8,
    },
  ]);

  const rankingFormRef = ref();
  //   const loadDataTable = async (params) => {
  //     const searchParams = searchFormRef.value.searchParams;
  //     const res = await getpublicPoolCustomers({
  //       areaId: searchParams.areaId,
  //       industry: searchParams.industry,
  //       //   startTime: searchParams.timerange[0],
  //       //   endTime: searchParams.timerange[1],
  //       ...params,
  //     });
  //     res.records = res.records.map((item, index) => {
  //       item.createTime = formatToDateTime(item.createTime);
  //       item.fallTime = formatToDateTime(item.fallTime);
  //       item.index = (res.current - 1) * res.size + index + 1;
  //       return item;
  //     });
  //     return res;
  //   };

  //   const tableRef = ref();
  function reloadRanking() {
    // tableRef.value.reload();
  }

  const columns = [
    {
      type: 'selection',
    },
    {
      title: '序号',
      width: 100,
      key: 'index',
    },
    {
      title: '客户名称',
      key: 'customerName',
    },
    {
      title: '客户所在地区',
      key: 'mergerName',
    },
    {
      title: '所属行业',
      key: 'industry',
    },
    {
      title: '创建时间',
      width: 160,
      key: 'createTime',
    },
    {
      title: '掉入公海时间',
      key: 'fallTime',
      width: 160,
    },
  ];

  const searchFormRef = ref();
  const loadDataTable = async (params) => {
    const searchParams = searchFormRef.value.searchParams;
    const res = await getpublicPoolCustomers({
      areaId: searchParams.areaId,
      industry: searchParams.industry,
      //   startTime: searchParams.timerange[0],
      //   endTime: searchParams.timerange[1],
      ...params,
    });
    res.records = res.records.map((item, index) => {
      item.createTime = formatToDateTime(item.createTime);
      item.fallTime = formatToDateTime(item.fallTime);
      item.index = (res.current - 1) * res.size + index + 1;
      return item;
    });
    return res;
  };

  const tableRef = ref();
  function reloadTable() {
    tableRef.value.reload();
  }
</script>

<style lang="less" scoped>
  .ranking-item {
    .title-wrapper {
      .title {
        margin-top: 20px;
        margin-bottom: 20px;
      }
    }
    .content-wrapper {
      height: 200px;
      overflow-y: hidden;
      &:hover {
        overflow-y: auto;
      }
      .progress {
        display: inline-block;
        margin-left: 20px;
        width: calc(100% - 80px);
      }
    }
  }
</style>

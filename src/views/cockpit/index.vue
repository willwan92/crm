<template>
  <n-card title="客户排名" style="margin-bottom: 12px">
    <RankingForm ref="rankingFormRef" @reload-ranking="loadRankingData" />
    <n-grid x-gap="80" :cols="3">
      <n-gi class="ranking-item">
        <div class="title-wrapper">
          <n-button strong secondary type="info" class="title"> 城市排名 </n-button>
        </div>
        <div v-if="cityData?.length" class="content-wrapper">
          <div v-for="(item, index) in cityData" :key="item.name">
            <span :style="{ color: getColor(index) }">N0.{{ index + 1 }} {{ item.name }}</span>
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

        <n-empty v-else description="暂无数据" style="text-align: left" />
      </n-gi>

      <n-gi class="ranking-item">
        <div class="title-wrapper">
          <n-button strong secondary type="info" class="title"> 项目排名 </n-button>
        </div>
        <div v-if="projectData?.length" class="content-wrapper">
          <div v-for="(item, index) in projectData" :key="item.name">
            <span :style="{ color: getColor(index) }">N0.{{ index + 1 }} {{ item.name }}</span>
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

        <n-empty v-else description="暂无数据" style="text-align: left" />
      </n-gi>
      <n-gi class="ranking-item">
        <div class="title-wrapper">
          <n-button strong secondary type="info" class="title"> 人员排名 </n-button>
        </div>
        <div v-if="accountData?.length" class="content-wrapper">
          <div v-for="(item, index) in accountData" :key="item.name">
            <span :style="{ color: getColor(index) }">N0.{{ index + 1 }} {{ item.name }}</span>
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

        <n-empty v-else description="暂无数据" style="text-align: left" />
      </n-gi>
    </n-grid>
  </n-card>
  <n-card title="客户总览" style="margin-bottom: 12px">
    <SearchForm ref="searchFormRef" @reload-table="reloadTable" />
    <BasicTable :toolbarShow="false" :columns="columns" :request="loadDataTable" ref="tableRef" />
  </n-card>
</template>

<script lang="ts" setup>
  import { ref, onMounted, h } from 'vue';
  import { useRouter } from 'vue-router';
  import { BasicTable } from '@/components/Table';
  import { formatToDateTime } from '@/utils/dateUtil';
  import { getRankingList, getCustomerList } from '@/api/cockpit';
  import SearchForm from './components/SearchForm.vue';
  import RankingForm from './components/RankingForm.vue';
  import { useThemeVars, NButton } from 'naive-ui';

  const themeVars = useThemeVars();
  const router = useRouter();

  const colors = ref([
    themeVars.value.errorColor,
    themeVars.value.warningColor,
    themeVars.value.successColor,
    themeVars.value.textColor3,
  ]);

  const getColor = (index) => {
    return index < 3 ? colors.value[index] : colors.value[3];
  };

  interface rankingData {
    name: string;
    count: number;
    percentage: number;
  }

  const cityData = ref<rankingData[]>();
  const projectData = ref<rankingData[]>();
  const accountData = ref<rankingData[]>();

  const rankingFormRef = ref();
  const loadRankingData = async () => {
    const rankingParams = rankingFormRef.value.rankingParams;
    const { cityRankingDTO, projectRankingDTO, accountRankingDTO } = await getRankingList({
      customerLevel: rankingParams.customerLevel,
      startTime: rankingParams.timerange ? rankingParams.timerange[0] : null,
      endTime: rankingParams.timerange ? rankingParams.timerange[1] : null,
    });

    if (Array.isArray(cityRankingDTO) && cityRankingDTO.length) {
      const firstCount = cityRankingDTO[0].count;
      cityData.value = cityRankingDTO.map((item) => {
        item.percentage = Math.floor((item.count / firstCount) * 100);
        return item;
      });
    } else {
      cityData.value = undefined;
    }

    if (Array.isArray(projectRankingDTO) && projectRankingDTO.length) {
      const firstCount = projectRankingDTO[0].count;
      projectData.value = projectRankingDTO.map((item) => {
        item.percentage = Math.floor((item.count / firstCount) * 100);
        return item;
      });
    } else {
      projectData.value = undefined;
    }

    if (Array.isArray(accountRankingDTO) && accountRankingDTO.length) {
      const firstCount = accountRankingDTO[0].count;
      accountData.value = accountRankingDTO.map((item) => {
        item.percentage = Math.floor((item.count / firstCount) * 100);
        return item;
      });
    } else {
      accountData.value = undefined;
    }
  };
  onMounted(loadRankingData);

  const columns = [
    {
      title: '序号',
      width: 100,
      key: 'index',
    },
    {
      title: '所属城市',
      key: 'cityName',
    },
    {
      title: '所属项目',
      key: 'accountResourceName',
    },
    {
      title: '招商角色',
      key: 'accountPosition',
    },
    {
      title: '招商人员',
      key: 'sourceAccountName',
    },
    {
      title: '客户等级',
      key: 'customerLevel',
    },
    {
      title: '客户名称',
      key: 'customerName',
      render(row) {
        return h(
          NButton,
          {
            type: 'info',
            text: true,
            onClick: () => {
              router.push('/customer/customer_detail/' + row.id);
            },
          },
          { default: () => row.customerName }
        );
      },
    },
    {
      title: '需求类型',
      key: 'unitType',
    },
    {
      title: '需求面积',
      key: 'requireArea',
    },
    {
      title: '审批通过时间',
      width: 160,
      key: 'approvalTime',
    },
  ];

  const searchFormRef = ref();
  const loadDataTable = async (params) => {
    const searchParams = searchFormRef.value.searchParams;
    const res = await getCustomerList({
      cityId: searchParams.cityId,
      projectId: searchParams.projectId,
      positionCode: searchParams.positionCode,
      customerLevel: searchParams.customerLevel,
      startTime: searchParams.timerange ? searchParams.timerange[0] : null,
      endTime: searchParams.timerange ? searchParams.timerange[1] : null,
      ...params,
    });
    res.records = res.records.map((item, index) => {
      item.approvalTime = formatToDateTime(item.approvalTime);
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
        width: 100%;
      }
    }

    .n-empty {
      margin-top: 60px;
    }
  }
</style>

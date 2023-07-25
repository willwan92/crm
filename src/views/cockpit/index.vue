<template>
  <n-card title="客户排名" style="margin-bottom: 12px">
    <RankingForm ref="rankingFormRef" @reload-ranking="handleQueryClick" />
    <n-grid :x-gap="getIsMobile ? 20 : 80" :cols="getIsMobile ? 1 : 3">
      <n-gi class="ranking-item">
        <div class="title-wrapper">
          <n-button strong secondary type="info" class="title"> 城市排名 </n-button>
          （合计：{{ totalArea.city }} m²）
        </div>
        <div v-if="cityData?.length" class="content-wrapper">
          <div
            v-for="(item, index) in cityData"
            :key="item.name"
            @click="handleCityClick(index)"
            :class="['item', index === selectedCityIndex && 'selected-item']"
          >
            <span :style="{ color: getColor(index) }">
              N0.{{ index + 1 }}. {{ item.name }} （{{ item.totalArea }}m²）
            </span>
            <n-progress
              type="line"
              class="progress"
              rail-color="#fff"
              :percentage="item.percentage"
              :color="getColor(index)"
              :height="index === selectedCityIndex ? 10 : 8"
              :indicator-text-color="getColor(index)"
            >
              <span>{{ item.count }} 个</span>
            </n-progress>
          </div>
        </div>

        <n-empty v-else description="暂无数据" style="text-align: left" />
      </n-gi>

      <n-gi class="ranking-item">
        <div class="title-wrapper">
          <n-button strong secondary type="info" class="title"> 项目排名 </n-button>
          （合计：{{ totalArea.project }} m²）
        </div>
        <div v-if="projectData?.length" class="content-wrapper">
          <div
            v-for="(item, index) in projectData"
            :key="item.name"
            :class="['item', index === selectedProjIndex && 'selected-item']"
            @click="handleProjClick(index)"
          >
            <span :style="{ color: getColor(index) }">
              N0.{{ index + 1 }}. {{ item.name }} （{{ item.totalArea }}m²）
            </span>
            <n-progress
              type="line"
              class="progress"
              :percentage="item.percentage"
              :color="getColor(index)"
              :height="index === selectedProjIndex ? 10 : 8"
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
          （合计：{{ totalArea.account }} m²）
        </div>
        <div v-if="accountData?.length" class="content-wrapper">
          <div v-for="(item, index) in accountData" :key="item.name">
            <span :style="{ color: getColor(index) }">
              N0.{{ index + 1 }}. {{ item.name }} （{{ item.totalArea }}m²）
            </span>
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
    <BasicTable
      :toolbarShow="false"
      :columns="columns"
      :scroll-x="1400"
      :request="loadDataTable"
      ref="tableRef"
    />
  </n-card>
</template>

<script lang="ts" setup>
  import { ref, onMounted, h, reactive, unref } from 'vue';
  import { useRouter } from 'vue-router';
  import { BasicTable } from '@/components/Table';
  import { formatToDateTime } from '@/utils/dateUtil';
  import { getRankingList, getCustomerList } from '@/api/cockpit';
  import SearchForm from './components/SearchForm.vue';
  import RankingForm from './components/RankingForm.vue';
  import { useThemeVars, NButton } from 'naive-ui';
  import { useProjectSetting } from '@/hooks/setting/useProjectSetting';

  const { getIsMobile } = useProjectSetting();

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
    id: number;
    name: string;
    count: number;
    percentage: number;
    totalArea: string;
  }

  const cityData = ref<rankingData[]>();
  const projectData = ref<rankingData[]>();
  const accountData = ref<rankingData[]>();

  const rankingFormRef = ref();
  const defaultTotalArea = () => ({
    city: 0,
    project: 0,
    account: 0,
  });
  let totalArea = reactive(defaultTotalArea());
  const loadRankingData = async () => {
    const rankingParams = rankingFormRef.value.rankingParams;
    const { cityRankingDTO, projectRankingDTO, accountRankingDTO } = await getRankingList({
      customerLevel: rankingParams.customerLevel,
      cityId: (cityData.value && cityData.value[selectedCityIndex.value]?.id) || null,
      projectId: (projectData.value && projectData.value[selectedProjIndex.value]?.id) || null,
      startTime: rankingParams.timerange ? rankingParams.timerange[0] : null,
      endTime: rankingParams.timerange ? rankingParams.timerange[1] : null,
    });

    totalArea = Object.assign(unref(totalArea), defaultTotalArea());
    if (Array.isArray(cityRankingDTO) && cityRankingDTO.length) {
      const firstCount = cityRankingDTO[0].count;
      cityData.value = cityRankingDTO.map((item) => {
        totalArea.city += Number(item.totalArea);
        item.percentage = Math.floor((item.count / firstCount) * 100);
        return item;
      });
    } else {
      cityData.value = undefined;
    }

    if (Array.isArray(projectRankingDTO) && projectRankingDTO.length) {
      const firstCount = projectRankingDTO[0].count;
      projectData.value = projectRankingDTO.map((item) => {
        totalArea.project += Number(item.totalArea);
        item.percentage = Math.floor((item.count / firstCount) * 100);
        return item;
      });
    } else {
      projectData.value = undefined;
    }

    if (Array.isArray(accountRankingDTO) && accountRankingDTO.length) {
      const firstCount = accountRankingDTO[0].count;
      accountData.value = accountRankingDTO.map((item) => {
        totalArea.account += Number(item.totalArea);
        item.percentage = Math.floor((item.count / firstCount) * 100);
        return item;
      });
    } else {
      accountData.value = undefined;
    }
  };
  onMounted(loadRankingData);

  const selectedCityIndex = ref(-1);
  const handleCityClick = (index) => {
    selectedCityIndex.value = selectedCityIndex.value !== index ? index : -1;
    loadRankingData();
  };

  const selectedProjIndex = ref(-1);
  const handleProjClick = (index) => {
    selectedProjIndex.value = selectedProjIndex.value !== index ? index : -1;
    loadRankingData();
  };

  const handleQueryClick = () => {
    selectedCityIndex.value = -1;
    selectedProjIndex.value = -1;
    loadRankingData();
  };

  const columns = [
    {
      title: '序号',
      width: 80,
      key: 'index',
      fixed: 'left',
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
      title: '客户等级',
      width: 80,
      align: 'center',
      key: 'customerLevel',
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
      nameKeyword: searchParams.nameKeyword,
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
    margin-bottom: 20px;
    .title-wrapper {
      .title {
        margin-top: 20px;
        margin-bottom: 20px;
      }
    }
    .content-wrapper {
      max-height: 200px;
      overflow-y: hidden;
      &:hover {
        overflow-y: auto;
      }
      .progress {
        width: 100%;
      }

      .item {
        cursor: pointer;
      }
      .selected-item {
        font-weight: bold;
        font-size: 16px;
      }
    }

    .n-empty {
      margin-top: 60px;
    }
  }
</style>

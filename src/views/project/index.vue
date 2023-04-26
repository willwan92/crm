<template>
  <n-card title="区域管理" class="area-card">
    <template #header-extra>
      <n-button type="info" ghost @click="showEditAreaModal">
        <n-icon>
          <PlusOutlined />
        </n-icon>
        添加区域
      </n-button>
    </template>
    <n-empty v-if="!areas.length && !areaLoading" description="暂无数据"> </n-empty>
    <n-spin :show="areaLoading">
      <n-grid x-gap="10" :cols="2">
        <n-gi v-for="(item, index) in areas">
          <n-card
            :title="item.name"
            size="small"
            :closable="!Boolean(item.cities.length)"
            class="area-card"
            @close="
              () => {
                handleCardClose(item);
              }
            "
          >
            <n-space>
              <n-tag v-for="city in item.cities" closable @close="handleDelCity(index, city)">
                {{ city.label }}
              </n-tag>
              <n-input
                v-show="item.isEdit"
                type="text"
                size="small"
                autofocus
                @keyup.enter="handleCreateCity(index, $event.target.value)"
                placeholder="输入城市名，回车键确定"
              >
                <template #suffix>
                  <n-button type="tertiary" text size="tiny" @click="item.isEdit = false">
                    <n-icon>
                      <CloseOutlined />
                    </n-icon>
                  </n-button>
                </template>
              </n-input>
              <n-button
                v-show="!item.isEdit"
                size="small"
                dashed
                @click="
                  () => {
                    item.isEdit = true;
                  }
                "
              >
                <template #icon>
                  <n-icon>
                    <PlusOutlined />
                  </n-icon>
                </template>
                添加城市
              </n-button>
            </n-space>
          </n-card>
        </n-gi>
      </n-grid>
    </n-spin>
  </n-card>
  <n-card title="项目管理">
    <template #header-extra>
      <n-button type="info" ghost @click="showEditModal">
        <n-icon>
          <PlusOutlined />
        </n-icon>
        添加项目
      </n-button>
    </template>
    <SearchForm ref="searchFormRef" @reload-table="reloadTable" />

    <BasicTable
      :toolbarShow="false"
      :columns="columns"
      :request="loadDataTable"
      :row-key="(row) => row.ip"
      ref="tableRef"
      :actionColumn="actionColumn"
    />

    <EditAreaModal ref="editAreaModal" @ok="getAreaList" />
    <EditModal ref="editModal" @ok="reloadTable" />
  </n-card>
</template>

<script lang="ts" setup>
  import { reactive, ref, h } from 'vue';
  import { BasicTable } from '@/components/Table';
  import { getResourceList, deleteResource, addResource } from '@/api/project';
  import EditModal from './components/EditModal.vue';
  import EditAreaModal from './components/EditAreaModal.vue';
  import SearchForm from './components/SearchForm.vue';
  import { PlusOutlined, CloseOutlined } from '@vicons/antd';
  import { NButton, useMessage, useDialog } from 'naive-ui';

  const message = useMessage();
  const dialog = useDialog();

  interface area {
    name: string;
    id: string;
    isEdit: Boolean;
    cities: any[];
  }
  const areas = ref<area[]>([]);

  const getCityList = (areaIndex) => {
    getResourceList({
      resourceType: 'CITY',
      areaId: areas.value[areaIndex].id,
      size: 9999,
      current: 1,
    }).then((res) => {
      areas.value[areaIndex].cities = res.records.map((city) => ({
        value: city.resourceId,
        label: city.resourceName,
      }));
    });
  };

  const areaLoading = ref(false);
  const getAreaList = () => {
    areaLoading.value = true;
    getResourceList({
      resourceType: 'AREA',
      size: 9999,
      current: 1,
    })
      .then((res) => {
        areas.value = res.records.map((item) => ({
          id: item.resourceId,
          name: item.resourceName,
          isEdit: false,
          cities: [],
        }));

        areas.value.forEach((item, index) => {
          getCityList(index);
        });
      })
      .finally(() => {
        areaLoading.value = false;
      });
  };
  getAreaList();

  const handleCardClose = (area) => {
    dialog.warning({
      title: '提示',
      content: `确定要删除区域 ${area.name} 吗？`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        await deleteResource(area.id);
        message.success(`区域 ${area.name} 已删除`);
        getAreaList();
      },
    });
  };

  const handleDelCity = (areaIndex, city) => {
    dialog.warning({
      title: '提示',
      content: `确定要删除城市 ${city.label} 吗？`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        await deleteResource(city.value);
        message.success(`城市 ${city.label} 已删除`);
        getCityList(areaIndex);
      },
    });
  };

  const handleCreateCity = async (areaIndex: number, cityName: string) => {
    const params = {
      resourceType: 'CITY',
      pid: areas.value[areaIndex].id,
      resourceName: cityName,
    };
    areas.value[areaIndex].isEdit = false;
    await addResource(params);
    await getCityList(areaIndex);
  };

  const columns = [
    {
      title: '所属区域',
      key: 'areaName',
    },
    {
      title: '所属城市',
      key: 'cityName',
    },
    {
      title: '项目名称',
      key: 'resourceName',
    },
  ];

  const actionColumn = reactive({
    width: 150,
    title: '操作',
    key: 'action',
    align: 'center',
    render(row) {
      return [
        h(
          NButton,
          {
            type: 'error',
            size: 'small',
            ghost: true,
            onClick: () => handleDelClick(row),
          },
          { default: () => '删除' }
        ),
      ];
    },
  });

  function handleDelClick(row) {
    dialog.warning({
      title: '提示',
      content: `确定要删除项目 ${row.resourceName} 吗？`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        await deleteResource(row.resourceId);
        message.success(`项目 ${row.resourceName} 已删除`);
        reloadTable();
      },
    });
  }

  const editModal = ref();
  const showEditModal = () => {
    editModal.value.show();
  };

  const editAreaModal = ref();
  const showEditAreaModal = () => {
    editAreaModal.value.show();
  };

  const searchFormRef = ref();
  const loadDataTable = async (params) => {
    const res = await getResourceList({
      ...searchFormRef.value.searchParams,
      ...params,
      resourceType: 'PROJECT',
    });
    return res;
  };

  const tableRef = ref();
  function reloadTable() {
    tableRef.value.reload();
  }
</script>

<style lang="less" scoped>
  .area-card {
    margin-bottom: 10px;
  }
</style>

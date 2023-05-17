<template>
  <n-modal
    v-model:show="modalVisible"
    preset="dialog"
    :title="`编辑 ${customerName} 的跟进记录`"
    :mask-closable="false"
    :on-after-leave="handleCompleteClick"
    style="width: 800px; height: 350px; overflow-y: auto"
  >
    <n-button type="primary" ghost @click="handleAddClick" style="margin: 20px 0"
      >添加跟进记录</n-button
    >
    <n-form
      v-for="(item, index) in formParams.followUpRecords"
      :label-placement="getIsMobile ? 'top' : 'left'"
      :inline="!getIsMobile"
      :key="index"
      :ref="formParams.formRefs[index]"
      :model="item"
      size="medium"
      :style="{ 'margin-bottom': getIsMobile ? '30px' : '0' }"
    >
      <n-form-item
        :label="`跟进记录 ${index + 1}`"
        path="followUpTime"
        :rule="{
          required: true,
          type: 'number',
          trigger: ['blur', 'input'],
          message: '请选择跟进日期',
        }"
      >
        <n-date-picker
          v-model:value="item.followUpTime"
          type="date"
          placeholder="跟进日期"
          :style="{ width: getIsMobile ? '100%' : 'auto' }"
        />
      </n-form-item>
      <n-form-item
        path="followUpDesc"
        :rule="{
          required: true,
          trigger: ['blur', 'input'],
          message: '请输入跟进事件',
        }"
        style="margin-top: -26px"
      >
        <n-input v-model:value="item.followUpDesc" placeholder="跟进事件" style="width: 360px" />
      </n-form-item>
      <n-button tertiary :loading="item.loading" @click="handleSaveClick(index)">保存</n-button>
    </n-form>
  </n-modal>
</template>

<script lang="ts" setup>
  import { reactive, ref, defineExpose, defineEmits } from 'vue';
  import { addFollowUpRecord, getDetail, updateFollowUpRecord } from '@/api/customer';
  import { useMessage } from 'naive-ui';
  import { useProjectSetting } from '@/hooks/setting/useProjectSetting';

  const { getIsMobile } = useProjectSetting();
  const message = useMessage();
  const modalVisible = ref(false);

  const defaultParams = () => ({
    customerId: '',
    projectId: '',
    formRefs: [ref()],
    followUpRecords: [
      {
        followUpRecordId: '',
        loading: false,
        followUpDesc: '',
        followUpTime: undefined,
      },
    ],
  });
  let formParams = reactive(defaultParams());

  const handleAddClick = () => {
    formParams.formRefs.push(ref());
    formParams.followUpRecords.push({
      followUpRecordId: '',
      loading: false,
      followUpDesc: '',
      followUpTime: undefined,
    });
  };

  const handleSaveClick = (index: number) => {
    // console.log(formParams.formRefs[index].value[0].validate);

    formParams.formRefs[index].value[0].validate((errors) => {
      if (errors) {
        return;
      }
      const record = formParams.followUpRecords[index];
      record.loading = true;
      let submitAction = addFollowUpRecord;
      let params: any = {
        followUpDesc: record.followUpDesc,
        followUpTime: record.followUpTime,
      };

      if (record.followUpRecordId) {
        params.followUpRecordId = record.followUpRecordId;
        submitAction = updateFollowUpRecord;
      } else {
        params.projectId = formParams.projectId;
        params.customerId = formParams.customerId;
      }
      submitAction(params)
        .then(() => {
          message.success(`跟进记录 ${index + 1} 保存成功`);
        })
        .finally(() => {
          record.loading = false;
        });
    });
  };

  const emit = defineEmits(['ok']);
  const handleCompleteClick = () => {
    emit('ok');
    modalVisible.value = false;
  };

  const customerName = ref();
  const show = async (id: string, name: string) => {
    customerName.value = name;
    formParams.customerId = id;
    modalVisible.value = true;
    getDetail(id).then((res) => {
      formParams.projectId = res.baseInfoDTO.accountResourceId;
      if (res.followUpRecordDTOS.length) {
        formParams.followUpRecords = res.followUpRecordDTOS.map((item) => {
          formParams.formRefs.push(ref());
          item.loading = false;
          return item;
        });
      } else {
        formParams.followUpRecords = [
          {
            followUpRecordId: '',
            loading: false,
            followUpDesc: '',
            followUpTime: undefined,
          },
        ];
      }
    });
  };

  defineExpose({
    show,
  });
</script>

<style></style>

<template>
  <n-modal
    v-model:show="modalVisible"
    preset="dialog"
    title="添加用户"
    :mask-closable="false"
    style="width: 600px"
  >
    <n-form
      ref="formRef"
      :model="formParams"
      :rules="rules"
      label-placement="left"
      label-align="right"
      label-width="auto"
      size="medium"
      require-mark-placement="right-hanging"
      style="margin: 30px 30px 0"
    >
      <n-form-item label="用户姓名" path="accoutName">
        <n-input v-model:value="formParams.accoutName" placeholder="用户真实姓名" />
      </n-form-item>
      <n-form-item label="登录名" path="userName">
        <n-input v-model:value="formParams.userName" placeholder="登录系统使用的名称" />
      </n-form-item>
      <n-form-item label="用户职位" path="accoutPosition">
        <n-select
          v-model:value="formParams.accoutPosition"
          label-field="label"
          value-field="label"
          :options="accoutPositionOptions"
          clearable
        />
      </n-form-item>
      <n-form-item label="登录密码" path="secret">
        <n-input v-model:value="formParams.secret" placeholder="" />
      </n-form-item>
      <n-form-item label="确认密码" path="reSecret">
        <n-input v-model:value="formParams.reSecret" placeholder="" />
      </n-form-item>
      <n-form-item label="用户角色" path="roleId">
        <n-select
          v-model:value="formParams.roleId"
          label-field="roleName"
          value-field="roleId"
          :options="roleOptions"
        />
      </n-form-item>
      <n-form-item label="所属项目" path="projectIdList">
        <n-select
          multiple
          v-model:value="formParams.projectIdList"
          label-field="projectName"
          value-field="projectId"
          :options="projectList"
        />
      </n-form-item>
    </n-form>

    <template #action>
      <n-space>
        <n-button type="info" :loading="isConfirming" @click="handleConfirmClick">确定</n-button>
        <n-button @click="modalVisible = false">取消</n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import { reactive, ref, unref, defineExpose, defineEmits } from 'vue';
import { FormRules } from 'naive-ui';
import { getRoleList } from '@/api/role';
import { saveUser } from '@/api/user';

const formRef = ref();
const accoutPositionOptions = [
  {
    label: '副总裁',
  },
  {
    label: '营销管理中心副总经理',
  },
  {
    label: '招商管理',
  },
  {
    label: '区域副总经理',
  },
  {
    label: '区域招商总监',
  },
  {
    label: '招商总监',
  },
  {
    label: '招商经理',
  },
  {
    label: '招商专员',
  },
];

const projectList = [
  {
    projectName: 'abc',
    projectId: 'abc',
  },
];

const defaultParams = () => ({
  userName: '',
  accoutPosition: '',
  accountName: '',
  secret: '',
  reSecret: '',
  projectIdList: [],
  roleId: '',
});
let formParams = reactive(defaultParams());

const isConfirming = ref(false);
const emit = defineEmits(['ok']);
const rules: FormRules = {
  accoutName: { required: true, trigger: ['blur'], message: '请输入用户姓名' },
  userName: { required: true, trigger: ['blur'], message: '请输入登录名' },
  accoutPosition: { required: true, trigger: ['blur'], message: '请输入用户职位' },
  roleId: { required: true, trigger: ['blur'], message: '请选择用户角色' },
  secret: { required: true, trigger: ['blur'], message: '请输入密码' },
  reSecret: { required: true, trigger: ['blur'], message: '请再次输入密码' },
};
const handleConfirmClick = () => {
  formRef.value?.validate((errors) => {
    if (errors) {
      return;
    }
    isConfirming.value = true;
    const params = {
      accountInfo: {
        userName: formParams.userName,
        accoutPosition: formParams.accoutPosition,
        accountName: formParams.accountName,
        secret: formParams.secret,
      },
      accountRoleInfo: {
        roleId: formParams.roleId
      },
      projectIdList: formParams.projectIdList
    };
    saveUser(params)
      .then(() => {
        modalVisible.value = false;
        emit('ok');
      })
      .finally(() => {
        isConfirming.value = false;
      });
  });
};

const modalVisible = ref(false);
const roleOptions = ref([]);
const show = () => {
  getRoleList().then((res) => {
    console.log(res);
    roleOptions.value = res.data;
  });

  formParams = Object.assign(unref(formParams), defaultParams());
  formRef.value?.restoreValidation();
  modalVisible.value = true;
};

defineExpose({
  show,
});
</script>

<style></style>

<template>
  <n-modal v-model:show="modalVisible" preset="dialog" :title="formParams.id ? '修改用户' : '添加用户'" :mask-closable="false"
    style="width: 600px">
    <n-form ref="formRef" :model="formParams" :rules="rules" label-placement="left" label-align="right" label-width="auto"
      size="medium" require-mark-placement="right-hanging" style="margin: 30px 30px 0">
      <n-form-item label="用户姓名" path="accountName">
        <n-input v-model:value="formParams.accountName" placeholder="用户真实姓名" />
      </n-form-item>
      <n-form-item label="登录名" path="userName">
        <n-input v-model:value="formParams.userName" placeholder="登录系统使用的名称" />
      </n-form-item>
      <n-form-item label="用户职位" path="accountPosition">
        <n-select v-model:value="formParams.accountPosition" label-field="label" value-field="label"
          :options="accoutPositionOptions" placeholder="请选择职位" />
      </n-form-item>
      <n-form-item v-show="!formParams.id" label="登录密码" path="secret">
        <n-input v-model:value="formParams.secret" type="password" placeholder="格式要求：8-16位字母和数字的组合" />
      </n-form-item>
      <n-form-item v-show="!formParams.id" label="确认密码" path="reSecret">
        <n-input v-model:value="formParams.reSecret" type="password" placeholder="请再次输入密码" />
      </n-form-item>
      <n-form-item label="用户角色" path="roleId">
        <n-select v-model:value="formParams.roleId" @update:value="handleRoleChange" label-field="roleName"
          value-field="roleId" :options="roleOptions" placeholder="请选择角色" />
      </n-form-item>
      <n-form-item v-show="formParams.roleId === '500'" label="负责区域" path="resourceId">
        <n-select v-model:value="formParams.resourceId" label-field="label" value-field="value" children-field="child"
          :options="areas" />
      </n-form-item>
      <n-form-item v-show="formParams.roleId === '300' || formParams.roleId === '400'" label="所属项目" path="resourceId">
        <n-cascader v-model:value="formParams.resourceId" :loading="areaLoading" :options="areas" check-strategy="child"
          :show-path="true" remote :on-load="loadCascsderChildren" />
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
import { reactive, ref, unref, defineExpose, defineEmits, handleError } from 'vue';
import { FormRules, FormItemRule } from 'naive-ui';
import md5 from 'md5';
import { PWD_REGEXP } from '@/enums/validatorEnum';
import { getRoleList } from '@/api/role';
import { getResourceList } from '@/api/project';
import { saveUser, getUserDetail } from '@/api/user';
import { UserAddOutlined } from '@vicons/antd';

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

interface cascaderOptions {
  value: string;
  label: string;
  depth: number;
  isLeaf: boolean;
  children?: any[];
}

const areas = ref<cascaderOptions[]>([]);
const loadCascsderChildren = async (option) => {
  const resourceTypes = [{
    type: 'CITY',
    pid: 'areaId',
  }, {
    type: 'PROJECT',
    pid: 'cityId',
  }]
  const resourceType = resourceTypes[option.depth].type
  const params = {
    resourceType,
    size: 9999,
    current: 1,
  }
  params[resourceTypes[option.depth].pid] = option.value
  const { records } = await getResourceList(params)
  const children: cascaderOptions[] = []
  Array.isArray(records) && records.forEach(item => {
    children.push({
      value: item.resourceId,
      label: item.resourceName,
      depth: option.depth + 1,
      isLeaf: option.depth === 1,
    })
  })
  option.children = children
}

const areaLoading = ref(false)
const getAreaList = () => {
  areaLoading.value = true;
  getResourceList({
    resourceType: 'AREA',
    size: 9999,
    current: 1,
  }).then(res => {
    areas.value = res.records.map(item => ({
      value: item.resourceId,
      label: item.resourceName,
      depth: 0,
      isLeaf: false
    }));
  }).finally(() => {
    areaLoading.value = false;
  })
}
getAreaList();

interface roleOption {
  roleId: string,
  roleCode: string,
  roleName: string,
}


const defaultParams = () => ({
  id: null,
  userName: '',
  accountPosition: undefined,
  accountName: '',
  secret: '',
  reSecret: '',
  resourceId: '',
  roleId: undefined,
});
let formParams = reactive(defaultParams());


const isConfirming = ref(false);
const emit = defineEmits(['ok']);
const rules = reactive<FormRules>({
  accountName: { required: true, trigger: ['blur', 'input'], message: '请输入用户姓名' },
  userName: { required: true, trigger: ['blur', 'input'], message: '请输入登录名' },
  accountPosition: { required: true, trigger: ['blur', 'input'], message: '请输入用户职位' },
  roleId: { required: true, trigger: ['blur', 'input'], message: '请选择用户角色' },
  secret: [{
    required: true,
    trigger: ['blur', 'input'],
    validator(rule: FormItemRule, value: string) {
      if (rule.required) {
        if (!value) {
          return new Error('请输入密码');
        } else {
          if (!PWD_REGEXP.test(value)) {
            return new Error('密码格式错误，请输入8-16位字母和数字的组合');
          }
        }
      }

      return true;
    },
  }],
  reSecret: [{
    required: true,
    trigger: ['blur', 'input'],
    validator(rule: FormItemRule, value: string) {
      if (rule.required) {
        if (!value) {
          return new Error('请再次输入密码');
        } else {
          if (value !== formParams.secret) {
            return new Error('两次输入密码不一致');
          }
        }
      }
      return true;
    },
  }],
  resourceId: [
    {
      required: true,
      trigger: ['blur', 'input'],
      message: '该参数不可为空',
    }
  ],
});


const handleRoleChange = (value: string) => {
  formParams.resourceId = ''
  if (Number(value) < 300) {
    rules.resourceId[0].required = false;
  } else {
    rules.resourceId[0].required = true;
  }
}

const handleConfirmClick = () => {
  formRef.value?.validate((errors) => {
    if (errors) {
      return;
    }
    isConfirming.value = true;
    const params: any = {
      accountInfo: {
        userName: formParams.userName,
        accountPosition: formParams.accountPosition,
        accountName: formParams.accountName,
      },
      accountRoleInfo: roleOptions.value.find((item) => {
        return formParams.roleId === item.roleId;
      }),
      resourceId: formParams.resourceId,
    };
    if (formParams.id) {
      params.accountInfo.id = formParams.id
    } else {
      params.accountInfo.secret = md5(formParams.userName + md5(formParams.secret)) as string
    }
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
const roleOptions = ref<roleOption[]>([]);

getRoleList().then((res) => {
  roleOptions.value = res.map((item) => ({
    roleId: item.roleId,
    roleCode: item.roleCode,
    roleName: item.roleName,
  }));
});
const show = async (id) => {
  formRef.value?.restoreValidation();
  modalVisible.value = true;
  if (id) {
    await getUserDetail(id).then(user => {
      formParams.id = user.accountId
      formParams.userName = user.userName
      formParams.accountPosition = user.accountPosition
      formParams.accountName = user.accountName
      formParams.roleId = user.roleId
      handleRoleChange(user.roleId);
      formParams.resourceId = user.resourceId
    })
    rules.secret[0].required = false;
    rules.reSecret[0].required = false;
  } else {
    formParams = Object.assign(unref(formParams), defaultParams());
    rules.secret[0].required = true;
    rules.reSecret[0].required = true;
  }
};

defineExpose({
  show,
});
</script>

<style></style>

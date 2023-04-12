<template>
  <n-modal
    v-model:show="modalVisible"
    preset="dialog"
    :title="formParams.id ? '修改用户' : '添加用户'"
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
      <n-form-item label="用户姓名" path="accountName">
        <n-input v-model:value="formParams.accountName" placeholder="用户真实姓名" />
      </n-form-item>
      <n-form-item label="登录名" path="userName">
        <n-input v-model:value="formParams.userName" placeholder="登录系统使用的名称" />
      </n-form-item>
      <n-form-item v-show="!formParams.id" label="登录密码" path="secret">
        <n-input
          v-model:value="formParams.secret"
          type="password"
          placeholder="格式要求：8-16位字母和数字的组合"
        />
      </n-form-item>
      <n-form-item v-show="!formParams.id" label="确认密码" path="reSecret">
        <n-input v-model:value="formParams.reSecret" type="password" placeholder="请再次输入密码" />
      </n-form-item>
      <!-- <n-form-item label="用户角色" path="roleId">
        <n-select
          v-model:value="formParams.roleId"
          @update:value="handleRoleChange"
          label-field="roleName"
          value-field="roleId"
          :options="roleOptions"
          placeholder="请选择角色"
        />
      </n-form-item> -->
      <n-form-item label="用户职位" path="accountPosition">
        <n-select
          v-model:value="formParams.accountPosition"
          @update:value="handlePositionChange"
          label-field="positionName"
          value-field="id"
          :options="accoutPositionOptions"
          placeholder="请选择职位"
        />
      </n-form-item>
      <n-form-item v-if="roleId === '500'" label="负责区域" path="resourceIdList">
        <n-select
          v-model:value="formParams.resourceIdList"
          label-field="label"
          value-field="value"
          children-field="child"
          multiple
          :options="areas"
        />
      </n-form-item>
      <n-form-item
        v-else-if="roleId === '300' || roleId === '400'"
        label="所属项目"
        path="resourceIdList"
      >
        <n-cascader
          remote
          multiple
          check-strategy="child"
          v-model:value="formParams.resourceIdList"
          :loading="areaLoading"
          :options="areas"
          :show-path="false"
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
  import { FormRules, FormItemRule } from 'naive-ui';
  import md5 from 'md5';
  import { PWD_REGEXP } from '@/enums/validatorEnum';
  import { getPositionList } from '@/api/role';
  import { getResourceList } from '@/api/project';
  import { saveUser, getUserDetail } from '@/api/user';

  const formRef = ref();

  interface positionOption {
    id: number;
    positionName: string;
    roleId: string;
    roleName: string;
  }
  const accoutPositionOptions = ref<positionOption[]>([]);
  getPositionList().then((res) => {
    accoutPositionOptions.value = res;
  });

  interface cascaderOptions {
    value: string;
    label: string;
    depth: number;
    isLeaf: boolean;
    children?: any[];
  }

  const areas = ref<cascaderOptions[]>([]);
  const loadCascsderChildren = async (option) => {
    const resourceTypes = [
      {
        type: 'CITY',
        pid: 'areaId',
      },
      {
        type: 'PROJECT',
        pid: 'cityId',
      },
    ];
    const resourceType = resourceTypes[option.depth].type;
    const params = {
      resourceType,
      size: 9999,
      current: 1,
    };
    params[resourceTypes[option.depth].pid] = option.value;
    const { records } = await getResourceList(params);
    const children: cascaderOptions[] = [];
    Array.isArray(records) &&
      records.forEach((item) => {
        const tmp = {
          value: item.resourceId,
          label: item.resourceName,
          depth: option.depth + 1,
          isLeaf: option.depth === 1,
        };
        children.push(tmp);
        if (!tmp.isLeaf) {
          loadCascsderChildren(tmp);
        }
      });
    option.children = children;
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
        areas.value = res.records.map((item) => {
          const area = {
            value: item.resourceId,
            label: item.resourceName,
            depth: 0,
            isLeaf: false,
          };
          loadCascsderChildren(area);
          return area;
        });
      })
      .finally(() => {
        areaLoading.value = false;
      });
  };
  getAreaList();

  const defaultParams = () => ({
    id: null,
    userName: '',
    accountPosition: undefined,
    accountName: '',
    secret: '',
    reSecret: '',
    resourceIdList: [],
  });
  let formParams = reactive(defaultParams());

  const isConfirming = ref(false);
  const emit = defineEmits(['ok']);
  const rules = reactive<FormRules>({
    accountName: { required: true, trigger: ['blur', 'input'], message: '请输入用户姓名' },
    userName: { required: true, trigger: ['blur', 'input'], message: '请输入登录名' },
    accountPosition: [
      {
        required: true,
        type: 'number',
        trigger: ['blur'],
        message: '请选择用户职位',
      },
    ],
    secret: [
      {
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
      },
    ],
    reSecret: [
      {
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
      },
    ],
    resourceIdList: [
      {
        required: true,
        type: 'array',
        trigger: ['change'],
        message: '该参数不可为空',
      },
    ],
  });

  const roleId = ref<string | undefined>();
  const handlePositionChange = (value: number) => {
    formParams.resourceIdList = [];
    const position = accoutPositionOptions.value.find((item) => item.id === value);
    roleId.value = position?.roleId;

    if (Number(roleId.value) < 300) {
      rules.resourceIdList[0].required = false;
    } else {
      rules.resourceIdList[0].required = true;
    }
  };

  const handleConfirmClick = () => {
    formRef.value?.validate((errors) => {
      if (errors) {
        return;
      }
      isConfirming.value = true;
      const params: any = {
        accountInfo: {
          userName: formParams.userName,
          accountPositionId: formParams.accountPosition,
          accountName: formParams.accountName,
        },
        resourceIdList: formParams.resourceIdList,
      };

      if (formParams.id) {
        params.accountInfo.id = formParams.id;
      } else {
        params.accountInfo.secret = md5(formParams.userName + md5(formParams.secret)) as string;
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
  //   const roleOptions = ref<roleOption[]>([]);

  //   getRoleList().then((res) => {
  //     roleOptions.value = res.map((item) => ({
  //       roleId: item.roleId,
  //       roleCode: item.roleCode,
  //       roleName: item.roleName,
  //     }));
  //   });
  const show = async (id) => {
    formRef.value?.restoreValidation();
    modalVisible.value = true;
    if (id) {
      await getUserDetail(id).then((user) => {
        formParams.id = user.accountId;
        formParams.userName = user.userName;
        formParams.accountPosition = user.accountPositionId;
        formParams.accountName = user.accountName;
        roleId.value = user.roleId;
        formParams.resourceIdList = user.resourceDTOList.map((item) => item.resourceId);
      });
      rules.secret[0].required = false;
      rules.reSecret[0].required = false;
    } else {
      roleId.value = '';
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

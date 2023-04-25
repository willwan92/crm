<template>
  <div class="view-account">
    <div class="view-account-header"></div>
    <div class="view-account-container" @keyup.enter="handleSubmit">
      <div class="view-account-top">
        <div class="view-account-top-logo">
          <img :src="websiteConfig.logo" alt="" />
        </div>
      </div>
      <div class="view-account-form">
        <n-form
          ref="formRef"
          label-placement="left"
          size="large"
          :model="formInline"
          :rules="rules"
        >
          <n-form-item path="userName">
            <n-input
              v-model:value="formInline.userName"
              ref="usernameRef"
              placeholder="请输入用户名"
            >
              <template #prefix>
                <n-icon size="18" color="#808695">
                  <PersonOutline />
                </n-icon>
              </template>
            </n-input>
          </n-form-item>
          <n-form-item path="password">
            <n-input
              v-model:value="formInline.password"
              type="password"
              showPasswordOn="click"
              placeholder="请输入密码"
            >
              <template #prefix>
                <n-icon size="18" color="#808695">
                  <LockClosedOutline />
                </n-icon>
              </template>
            </n-input>
          </n-form-item>
          <n-form-item path="verCode">
            <n-input v-model:value="formInline.verCode" placeholder="请输入验证码" />
            <img
              class="captcha-img"
              @click="refreshCaptach"
              :src="formInline.captchaUrl"
              title="点击刷新"
            />
          </n-form-item>
          <n-form-item>
            <n-button type="primary" @click="handleSubmit" size="large" :loading="loading" block>
              登录
            </n-button>
          </n-form-item>
        </n-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import md5 from 'md5';
  import { useUserStore } from '@/store/modules/user';
  import { useMessage } from 'naive-ui';
  import { PageEnum } from '@/enums/pageEnum';
  import { LockClosedOutline, PersonOutline } from '@vicons/ionicons5';
  import { websiteConfig } from '@/config/website.config';
  import { storage } from '@/utils/Storage';
  import { TABS_ROUTES, HOME_PATH } from '@/store/mutation-types';
  import { useGlobSetting } from '@/hooks/setting';

  interface FormState {
    userName: string;
    password: string;
    verCode: string;
  }
  const usernameRef = ref();
  const formRef = ref();
  const message = useMessage();
  const loading = ref(false);

  onMounted(() => {
    usernameRef.value.focus();
  });

  const globSetting = useGlobSetting();
  const urlPrefix = globSetting.urlPrefix || '';

  const formInline = reactive({
    userName: '',
    password: '',
    verCode: '',
    captchaUrl: `${urlPrefix}/sys/captcha`,
  });

  const rules = {
    userName: { required: true, message: '请输入用户名', trigger: 'blur' },
    password: { required: true, message: '请输入密码', trigger: 'blur' },
    verCode: { required: true, message: '请输入验证码', trigger: 'blur' },
  };

  const userStore = useUserStore();

  const router = useRouter();
  //   const route = useRoute();
  const refreshCaptach = () => {
    formInline.captchaUrl = `${urlPrefix}/sys/captcha?t=${Date.now()}`;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    loginHandle();
  };
  const loginHandle = () => {
    if (loading.value) return;
    formRef.value.validate(async (errors) => {
      if (!errors) {
        const { userName, password, verCode } = formInline;
        message.loading('登录中...');
        loading.value = true;
        const params: FormState = {
          userName,
          password: md5(userName + md5(password)) as string,
          verCode,
        };
        try {
          const userInfo = await userStore.login(params);

          message.destroyAll();
          storage.remove(TABS_ROUTES);
          // const toPath = decodeURIComponent((route.query?.redirect || '/') as string);
          message.success('登录成功，即将进入系统');
          const roleHomes = [
            {
              path: 'ADMIN_HOME',
              roles: ['100'],
            },
            {
              path: 'SENIOR_HOME',
              roles: ['500', '200'],
            },
            {
              path: 'MIDDLE_HOME',
              roles: ['300'],
            },
            {
              path: 'BASE_HOME',
              roles: ['400'],
            },
          ];
          const home = roleHomes.find((item) => item.roles.includes(userInfo.roleId));
          console.log(PageEnum[home]);
          const homepath = PageEnum[home?.path];
          userStore.setHomepage(homepath);
          storage.set(HOME_PATH, homepath);
          router.replace(homepath);
        } catch (error) {
          refreshCaptach();
        } finally {
          loading.value = false;
        }
      }
    });
  };
</script>

<style lang="less" scoped>
  .view-account {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: auto;

    &-container {
      flex: 1;
      padding: 32px 12px;
      max-width: 384px;
      min-width: 320px;
      margin: 0 auto;
    }

    &-top {
      padding: 32px 0;
      text-align: center;
      margin-bottom: 60px;
      margin-top: 80px;

      &-logo img {
        display: inline-block;
        width: 240px;
      }
    }

    &-form {
      padding: 20px;
      background-color: #fff;
    }

    &-other {
      width: 100%;
    }

    .default-color {
      color: #515a6e;
      .ant-checkbox-wrapper {
        color: #515a6e;
      }
    }
    .captcha-img {
      width: 110px;
      margin-left: 10px;
    }
  }

  @media (min-width: 768px) {
    .view-account {
      background-image: url('../../assets/images/login-bg-blue.jpg');
      background-repeat: no-repeat;
      background-position: 50%;
      background-size: cover;
    }

    .page-account-container {
      padding: 32px 0 24px 0;
    }
  }
</style>

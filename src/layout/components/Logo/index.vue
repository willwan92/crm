<template>
  <div :class="[isMobile && 'logo-mobile', 'logo']">
    <!-- <img :src="websiteConfig.logo" alt="" :class="{ 'mr-2': !collapsed }" />
    <h2 v-show="!collapsed" class="title">{{ websiteConfig.title }}</h2> -->
    <img v-show="!isMobile" :src="websiteConfig.logo" alt="logo" />
    <img v-show="isMobile" :src="websiteConfig.mobileLogo" alt="logo" />
  </div>
</template>

<script lang="ts">
  import { websiteConfig } from '@/config/website.config';
  export default {
    name: 'Index',
    props: {
      collapsed: {
        type: Boolean,
      },
      isMobile: {
        type: Boolean,
      },
    },
    data() {
      return {
        websiteConfig,
      };
    },
  };
</script>

<style lang="less" scoped>
  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 200px;
    height: 64px;
    line-height: 64px;
    overflow: hidden;
    white-space: nowrap;

    img {
      width: auto;
      height: 48px;
    }

    .title {
      margin-bottom: 0;
    }
  }

  .logo-mobile {
    width: 64px;
  }
</style>

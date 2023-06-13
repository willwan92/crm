import type { Plugin } from 'vite';
import Components from 'unplugin-vue-components/vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';

import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { VitePWA } from 'vite-plugin-pwa';

import { configHtmlPlugin } from './html';
import { configMockPlugin } from './mock';
import { configCompressPlugin } from './compress';

export function createVitePlugins(viteEnv: ViteEnv, isBuild: boolean, prodMock) {
  const { VITE_USE_MOCK, VITE_BUILD_COMPRESS, VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE } = viteEnv;

  const vitePlugins: (Plugin | Plugin[])[] = [
    // have to
    vue(),
    // have to
    vueJsx(),

    VitePWA({
      manifest: {
        name: '佳海CRM',
        short_name: '佳海CRM',
        description: '佳海客户管理系统',
        theme_color: '#ffffff',
        icons: [
          //添加图标， 注意路径和图像像素正确
          {
            src: './128.png',
            sizes: '128x128',
            type: 'image/png',
          },
          {
            src: './144.png',
            sizes: '144x144',
            type: 'image/png',
          },
          {
            src: './192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: './256.png',
            sizes: '256x256',
            type: 'image/png',
          },
          {
            src: './512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      registerType: 'autoUpdate',
      //   workbox: {
      //     globPatterns: ['**/*.{js,css,html,ico,png,svg}'], //缓存相关静态资源
      //     runtimeCaching: [
      //       {
      //         //由于要测试第三方API， 这里配置缓存访问第三方API的资源
      //         handler: 'CacheFirst',
      //         urlPattern: /^https:\/\/jsonplaceholder/, //注意，要修改成要测试的API。请使用正则表达式匹配
      //         method: 'GET',
      //         options: {
      //           cacheName: 'test-external-api', //创建缓存名称
      //           expiration: {
      //             maxEntries: 10,
      //             maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
      //           },
      //           cacheableResponse: {
      //             statuses: [0, 200],
      //           },
      //         },
      //       },
      //     ],
      //   },
      devOptions: {
        enabled: true,
      },
    }),

    // 按需引入NaiveUi且自动创建组件声明
    Components({
      dts: true,
      resolvers: [NaiveUiResolver()],
    }),
  ];

  // vite-plugin-html
  vitePlugins.push(configHtmlPlugin(viteEnv, isBuild));

  // vite-plugin-mock
  VITE_USE_MOCK && vitePlugins.push(configMockPlugin(isBuild, prodMock));

  if (isBuild) {
    // rollup-plugin-gzip
    vitePlugins.push(
      configCompressPlugin(VITE_BUILD_COMPRESS, VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE)
    );
  }

  return vitePlugins;
}

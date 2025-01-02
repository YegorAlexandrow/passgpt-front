import { RouteRecordRaw } from 'vue-router';

console.log('@@', process.env);

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () =>
      import(
        process.env.INDEX_PAGE == 'chat'
          ? 'layouts/MainLayout.vue'
          : 'layouts/LandingLayout.vue'
      ),
    children: [
      {
        path: '',
        component: () =>
          import(
            process.env.INDEX_PAGE == 'chat'
              ? 'pages/IndexPage.vue'
              : 'pages/LandingPage.vue'
          ),
      },
    ],
  },
  {
    path: '/chat',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
  },
  {
    path: '/login',
    component: () => import('layouts/EmptyLayout.vue'),
    children: [{ path: '', component: () => import('pages/SignInPage.vue') }],
  },
  {
    path: '/subscribe',
    component: () => import('layouts/EmptyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/SubscribePage.vue') },
    ],
  },
  {
    path: '/share',
    component: () => import('layouts/EmptyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/SharedChatPage.vue') },
    ],
  },
  {
    path: '/landing',
    component: () => import('layouts/LandingLayout.vue'),
    children: [{ path: '', component: () => import('pages/LandingPage.vue') }],
  },
  {
    path: '/special',
    component: () => import('layouts/EmptyLayout.vue'),
    children: [{ path: '', component: () => import('pages/PromoPage.vue') }],
  },
  {
    path: '/test',
    component: () => import('layouts/EmptyLayout.vue'),
    children: [{ path: '', component: () => import('pages/TestPage.vue') }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;

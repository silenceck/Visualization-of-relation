import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/views/layout/index.vue'
import Index from './views/Index1.vue'
import Register from './views/Register.vue'
import Login from './views/Login.vue'
import Home from './views/Home1.vue'
import Info from './views/Info.vue'
import FundList from './views/FundList.vue'
import NotFound from './views/404.vue'
import CreateChart from './views/CreateChart.vue'
import TextRelation from './views/TextRelation.vue'
import PubmedCreeper from './views/PubmedCreeper.vue'
import Add from './components/Add.vue'
import Search from './components/Search.vue'
import Profile from './views/Profile.vue'
import MyNetwork from './components/MyNetworks.vue'
import MyTextRelation from './components/MyTextRelation.vue'


Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/index',
      // component:Home1,
    },
    {
      path: '/index',
      name: 'index',
      component: Index,
      children:[            
        {                                     
          path:'',
          component:Home,
        },
        {                                     
          path:'/1',
          component:Home,
        },
        {                                     
          path:'/2',
          name:'create_chart',
          component:CreateChart,
          children:[
              {
                path:'',
                component: Add
              },
              {
                path:'/add',
                component: Add
              },
              {
                path:'/search',
                component: Search
              }
            ]
          },
        {                                     
            path:'/3',
            component:PubmedCreeper,
        },
        { 
            path: '/profile',
            component: Profile,
            children:[
              {
                path:'',
                component: Info
              },
              {
                path:'/info',
                component: Info
              },
              {
                path:'/my-network',
                component: MyNetwork,
              },
              {
                path:'/my-text-relation',
                component: MyTextRelation,
              }
            ]
        },
        {                                     
          path:'/info',
          name:'info',
          component:Info,
        },
        {                                     
          path:'/fundlist',
          name:'fundlist',
          component:FundList,
        },
      ]
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    // 管理模块
    {
      path: '/admin',
      component: Layout,
      redirect: '/admin/dashboard',
      children: [{
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: 'Dashboard', icon: 'dashboard' }
      }]
    },
  
    {
      path: '/example',
      component: Layout,
      redirect: '/example/table',
      name: 'Example',
      meta: { title: 'Example', icon: 'example' },
      children: [
        {
          path: 'table',
          name: 'Table',
          component: () => import('@/views/table/index.vue'),
          meta: { title: 'Table', icon: 'table' }
        },
        {
          path: 'tree',
          name: 'Tree',
          component: () => import('@/views/tree/index.vue'),
          meta: { title: 'Tree', icon: 'tree' }
        }
      ]
    },
  
    {
      path: '/user',
      component: Layout,
      children: [
        {
          path: 'index',
          name: 'user',
          component: () => import('@/views/form/index.vue'),
          meta: { title: 'user', icon: 'form' }
        }
      ]
    },
    {
      path: '/nested',
      component: Layout,
      redirect: '/nested/menu1',
      name: 'Nested',
      meta: {
        title: 'Nested',
        icon: 'nested'
      },
      children: [
        {
          path: 'menu1',
          component: () => import('@/views/nested/menu1/index.vue'), // Parent router-view
          name: 'Menu1',
          meta: { title: 'Menu1' },
          children: [
            {
              path: 'menu1-1',
              component: () => import('@/views/nested/menu1/menu1-1/index.vue'),
              name: 'Menu1-1',
              meta: { title: 'Menu1-1' }
            },
            {
              path: 'menu1-2',
              component: () => import('@/views/nested/menu1/menu1-2/index.vue'),
              name: 'Menu1-2',
              meta: { title: 'Menu1-2' },
              children: [
                {
                  path: 'menu1-2-1',
                  component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1/index.vue'),
                  name: 'Menu1-2-1',
                  meta: { title: 'Menu1-2-1' }
                },
                {
                  path: 'menu1-2-2',
                  component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2/index.vue'),
                  name: 'Menu1-2-2',
                  meta: { title: 'Menu1-2-2' }
                }
              ]
            },
            {
              path: 'menu1-3',
              component: () => import('@/views/nested/menu1/menu1-3/index.vue'),
              name: 'Menu1-3',
              meta: { title: 'Menu1-3' }
            }
          ]
        },
        {
          path: 'menu2',
          component: () => import('@/views/nested/menu2/index.vue'),
          meta: { title: 'menu2' }
        }
      ]
    },
  
    {
      path: 'external-link',
      component: Layout,
      children: [
        {
          path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
          meta: { title: 'External Link', icon: 'link' }
        }
      ]
    },
    {
      path: '*',
      name: 'not found',
      component: NotFound
    },
    {
      path: '/test',
      name: '',
      component: Info,
    },
  ]
})

// 路由守卫

router.beforeEach((to, from, next) => {
  const isLogin = localStorage.eleToken ? true : false;
  if (to.path == '/login' || to.path == 'register') {
    next();
  } else {
    // isLogin ? next() : next('/login')
    next()
  }
})


export default router;
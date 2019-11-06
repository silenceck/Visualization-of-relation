import Vue from 'vue'
import Router from 'vue-router'
import Index from './views/Index1.vue'
import Register from './views/Register.vue'
import Login from './views/Login.vue'
import Home from './views/Home1.vue'
import Info from './views/Info.vue'
import FundList from './views/FundList.vue'
import NotFound from './views/404.vue'
import CreateChart from './views/CreateChart.vue'
import TextRelation from './views/TextRelation.vue'
import Add from './components/Add.vue'
import ADD1 from './components/ADD1.vue'
import Search from './components/Search.vue'


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
          component:TextRelation,
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
    {
      path: '*',
      name: 'not found',
      component: NotFound
    },
    {
      path: '/test',
      name: '',
      component: TextRelation,
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
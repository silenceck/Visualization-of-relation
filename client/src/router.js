import Vue from 'vue'
import Router from 'vue-router'
import Index from './views/Index.vue'
import Register from './views/Register.vue'
import Login from './views/Login.vue'
import Home from './views/Home.vue'
import Info from './views/Info.vue'
import NotFound from './views/404.vue'
import CreateChart from './views/CreateChart.vue'
import TextRelation from './views/TextRelation.vue'
import Profile from './views/Profile.vue'
import MyNetwork from './components/MyNetworks.vue'
import Entry from './views/Entry.vue'


Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/index',
    },
    {
      path: '/index',
      name: 'index',
      component: Index,
      children:[            
        {                                     
          path:'/index',
          component: Entry,
        },
        {                                     
          path:'/home',
          component:Home,
        },
        {                                     
          path:'/create_chart',
          name:'create_chart',
          component:CreateChart,
        },
        {                                     
            path:'/relation_extraction',
            component:TextRelation,
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
                path:'/my_network',
                component: MyNetwork,
              },
            ]
        },
        {                                     
          path:'/info',
          name:'info',
          component:Info,
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
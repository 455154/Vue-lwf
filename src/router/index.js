import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/User/users.vue'
import Rights from '../components/Power/Rights.vue'
import Roles from '../components/Power/Roles.vue'
import Categories from '../components/Goods/Categories.vue'
import Params from '../components/Goods/params.vue'
import myheader from '../components/mycommon.vue'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.use(VueRouter)
Vue.use(myheader)
const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Categories },
      { path: '/params', component: Params }
    ]
  }
]

const router = new VueRouter({
  routes
})
NProgress.configure({ ease: 'ease', speed: 500 })
// 挂载路由导航守卫 to 将要访问的路径 from 代表从哪个路径而来 next 代表放行 为一个函数
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const token = window.sessionStorage.getItem('token')
  if (!token) return next('/login')
  NProgress.start()
  next()
})
router.afterEach(route => {
  NProgress.done()
})
export default router

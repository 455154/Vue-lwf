import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../components/Login.vue";
import Home from "../components/Home.vue";

Vue.use(VueRouter);

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: Login },
  { path: "/home", component: Home }
];

const router = new VueRouter({
  routes
});

// 挂载路由导航守卫 to 将要访问的路径 from 代表从哪个路径而来 next 代表放行 为一个函数
router.beforeEach((to, from, next) => {
  if (to.path === "/login") return next();
  const token = window.sessionStorage.getItem("token");
  if (!token) return next("/login");
});
export default router;

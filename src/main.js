import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/global.css'
import {
  Input,
  Switch,
  Button,
  Form,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  Submenu,
  MenuItemGroup,
  MenuItem,
  FormItem,
  Message,
  Breadcrumb,
  Card,
  BreadcrumbItem,
  Row,
  Col,
  TableColumn,
  Table,
  Tooltip,
  MessageBox,
  Pagination,
  Dialog
} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// axios 请求拦截器 在每次发送请求之前 获取 config 在里面的请求头上面设置一个Authorization 值为 token
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios
Vue.prototype.$confirm = MessageBox.confirm

Vue.use(Dialog)
Vue.use(Pagination)
Vue.use(Breadcrumb)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Col)
Vue.use(Row)
Vue.use(Card)
Vue.use(BreadcrumbItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Button)
Vue.use(Form)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(FormItem)

Vue.prototype.$message = Message

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

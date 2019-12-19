<template>
  <el-container>
    <!-- header -->
    <el-header>
      <div>
        <img src="../assets/logo.png"
             alt="">
        <span>Vue Test 管理系统</span>
      </div>
      <el-button type="info"
                 @click="logout">退出按钮
      </el-button>
    </el-header>
    <!-- content -->
    <el-container>
      <!-- Aside -->
      <el-aside :width="isCollapse ? '64px':'200px'"
                class="aside">
        <div class="toggle"
             @click="toggleBtn">| | |</div>
        <el-menu :collapse="isCollapse"
                 :collapse-transition="false"
                 class="el-menu-vertical-demo"
                 background-color="skyblue"
                 :default-active="getActive"
                 text-color="#f37349"
                 active-text-color="yellow"
                 router
                 unique-opened>
          <!-- 一级菜单 -->
          <el-submenu :index="index+''"
                      v-for="(item, index) in menus"
                      :key="index">
            <!-- 图标 -->
            <template slot="title">
              <i :class="icon[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item v-for="(children, childrenIndex) in item.children"
                          :key="childrenIndex"
                          :index="'/'+children.path"
                          @click="active('/'+children.path)">
              <template slot="title">
                <i class="el-icon-right"></i>
                <!-- 文本 -->
                <span>{{children.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- main -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      // 激活 被点击的选项 存储到 session 里 刷新后拿出来不
      getActive: '',
      isCollapse: false,
      menus: [],
      icon: {
        '125': 'el-icon-s-promotion',
        '103': 'el-icon-s-home',
        '101': 'el-icon-s-release',
        '102': 'el-icon-s-ticket',
        '145': 'el-icon-s-management'
      }
    }
  },
  created () {
    this.getMens()
    console.log(window.sessionStorage.getItem('active'));
    this.getActive = window.sessionStorage.getItem('active')
  },
  methods: {
    active (path) {
      window.sessionStorage.setItem('active', path)
      console.log(path);
      // 点击后继续重新复制
      this.getActive = window.sessionStorage.getItem('active')
    },
    toggleBtn () {
      this.isCollapse = !this.isCollapse;
    },
    async getMens () {
      let { data: res } = await this.$http.get('/menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menus = res.data
    },
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
}
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: lightblue;
  font-size: 20px;
  color: #fff;
  div {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    span {
      margin-left: 10px;
    }
    img {
      height: 100%;
      border-radius: 50%;
    }
  }
}
.el-aside {
  background-color: skyblue;
}
.el-main {
  background-color: #eaedf1;
}
.el-menu {
  border-right: 0;
}
.toggle {
  text-align: center;
  color: #ccc;
  background-color: #ddd;
  cursor: pointer;
}
</style>

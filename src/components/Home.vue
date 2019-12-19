<template>
  <div>
    <el-button type="info"
               @click="logout">退出按钮</el-button>
    Home 组件
  </div>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  created () {

  },
  methods: {
    logout () {
      window.sessionStorage.clear();
      this.$router.push('/login')
      
    }
  }
}
</script>

<style lang="less" scoped>
</style>

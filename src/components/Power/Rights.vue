<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-table :data="rightsList"
                border
                stripe>
        <el-table-column label="编号"
                         type="index"></el-table-column>
        <el-table-column label="权限名称"
                         prop="authName"></el-table-column>
        <el-table-column label="路径"
                         prop="path"></el-table-column>
        <el-table-column label="权限等级"
                         prop="level">
          <template slot-scope="scopr">
            <el-tag v-if="scopr.row.level === '0'">一级</el-tag>
            <el-tag type="success"
                    v-else-if="scopr.row.level === '1'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template></el-table-column>

      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rightsList: []
    }
  },
  created () {
    this.getRightsList()
  },
  methods: {
    async getRightsList () {
      let { data: res } = await this.$http.get(`rights/list`)
      if (res.meta.status !== 200) return this.$message.error('获取权限列表失败')
      this.rightsList = res.data

    }
  }
}
</script>

<style lang="less" scoped>
.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}
</style>

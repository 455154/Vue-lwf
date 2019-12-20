<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- List -->
      <el-row>
        <el-table :data="RolesList"
                  border
                  stripe>
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-row v-for="(item, i) in scope.row.children"
                      :class="['bdbottom',i === 0 ? 'bdtop':'']"
                      :key="item.id"
                      class="aic">
                <!-- 一级 -->
                <el-col :span='5'>
                  <el-tag closable
                          @close="deleteByid(scope.row,item.id)">{{item.authName}}</el-tag>
                  <i class="el-icon-d-arrow-right"></i>
                </el-col>
                <!-- 二级和三级 -->
                <!-- for循环嵌套 -->
                <el-col :span="19">
                  <el-row :class="['aic',i2 === 0 ? '':'bdtop']"
                          v-for="(item2, i2) in item.children"
                          :key="item2.id">
                    <el-col :span="6">
                      <el-tag type="warning"
                              closable
                              @close="deleteByid(scope.row,item2.id)">{{item2.authName}}</el-tag>

                      <i class="el-icon-d-arrow-right"></i>
                    </el-col>
                    <!-- 嵌套三级循环 -->
                    <el-col :span="18">
                      <el-tag v-for="(item3, i3) in item2.children"
                              :key="item3.id"
                              type="danger"
                              closable
                              @close="deleteByid(scope.row,item3.id)">{{item3.authName}}</el-tag>

                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column type="index"></el-table-column>
          <el-table-column label="角色名称"
                           prop="roleName"></el-table-column>
          <el-table-column label="角色描述"
                           prop="roleDesc"></el-table-column>
          <el-table-column label="操作"
                           width="350">
            <template slot-scope="scope">
              <el-button type="info"
                         size="mini"
                         icon="el-icon-edit"
                         round>编辑</el-button>
              <el-button type="warning"
                         size="mini"
                         icon="el-icon-delete"
                         round>删除</el-button>
              <el-button type="danger"
                         icon="el-icon-setting"
                         size="mini"
                         @click="showSetRights(scope.row)"
                         round>分配权限</el-button>
            </template>
          </el-table-column>

        </el-table>
      </el-row>
    </el-card>
    <!-- 分配权限 -->
    <el-dialog title="分配权限"
               :visible.sync="RightsdialogVisible"
               @close="setRightsClose"
               width="50%">
      <el-tree :data="RightsList"
               :props="defaultProps"
               node-key="id"
               show-checkbox
               default-expand-all
               ref="treeRef"
               :default-checked-keys='defaultKeys'
               @node-click="handleNodeClick"></el-tree>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="RightsdialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      roleId: '',
      // 默认选中数组
      defaultKeys: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      RightsList: [],
      RightsdialogVisible: false,
      RolesList: []
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    // 权限分配确定
    async allotRights () {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const keysId = keys.join(',')
      console.log(keysId);
      let { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: keysId })
      if (res.meta.status !== 200) return this.$message.error('分配权限失败')
      this.getRolesList()
      this.RightsdialogVisible = false
    },
    // 清空权限默认选中
    setRightsClose () {
      this.defaultKeys = []
    },
    // 权限分配默认选中 key 递归得到三级
    getDefaultKeys (node, arr) {
      if (!node.children) return arr.push(node.id)
      node.children.forEach(item => {
        this.getDefaultKeys(item, arr)
      })
    },
    // 权限分配节点点击 
    handleNodeClick (data) {
      console.log(data);

    },
    // 权限分配页面显示
    async showSetRights (row) {
      this.roleId = row.id
      // 获取权限数据
      let { data: res } = await this.$http.get(`rights/tree`)
      if (res.meta.status !== 200) return this.$message.error('获取失败')
      // RightsList 保存数据
      this.RightsList = res.data
      // 默认选中
      this.getDefaultKeys(row, this.defaultKeys)
      console.log(res.data);
      this.RightsdialogVisible = true
    },
    // 删除三级权限功能
    deleteByid (user, id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let { data: res } = await this.$http.delete(`roles/${user.id}/rights/${id}`)
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error('删除失败')
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        user.children = res.data
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    async getRolesList () {
      let { data: res } = await this.$http.get(`roles`)
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败')
      console.log(res);
      this.RolesList = res.data
    }
  }
}
</script>

<style lang="less" scoped>
.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #ccc;
}
.bdbottom {
  border-bottom: 1px solid #ccc;
}
.aic {
  display: flex;
  align-items: center;
}
</style>

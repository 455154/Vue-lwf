<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- content search-->
      <el-row :gutter=20>
        <el-col :span='7'>
          <div style="">
            <el-input placeholder="请输入内容"
                      clearable
                      v-model="queryInfo.query"
                      @clear="getUsers"
                      class="input-with-select">
              <el-button slot="append"
                         icon="el-icon-search"
                         @click="getUsers"></el-button>
            </el-input>
          </div>
        </el-col>
        <el-col :span="4">
          <el-button type="primary"
                     @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- Userlist -->
      <el-table :data="usersList"
                border
                stripe
                style="width: 100%">
        <el-table-column type="index"
                         label="编号"
                         width="60">
        </el-table-column>
        <el-table-column prop="username"
                         label="姓名"
                         width="180">
        </el-table-column>
        <el-table-column prop="email"
                         label="邮箱">
        </el-table-column>
        <el-table-column prop="mobile"
                         label="电话">
        </el-table-column>
        <el-table-column prop="role_name"
                         label="角色">
        </el-table-column>
        <el-table-column prop="mg_state"
                         width="60"
                         label="状态">
          <!-- 作用域 插槽 scope.row 拿到渲染的数据 根据 start 进行渲染 -->
          <template slot-scope="scope">
            <div>
              <el-switch v-model="scope.row.mg_state"
                         @change="userChange(scope.row)">
              </el-switch>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         width="180">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-tooltip class="item"
                        data-id="scope.row"
                        effect="dark"
                        content="修改"
                        :enterable='false'
                        placement="top-start">
              <el-button type="primary"
                         @click="showEditUser(scope.row.id)"
                         icon="el-icon-edit"
                         size="mini"
                         circle></el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip class="item"
                        effect="dark"
                        content="删除"
                        :enterable='false'
                        placement="top-start">
              <el-button type="danger"
                         size="mini"
                         @click="del(scope.row.id)"
                         icon="el-icon-delete"
                         circle></el-button>
            </el-tooltip>
            <!-- 分配角色 -->
            <el-tooltip class="item"
                        effect="dark"
                        content="分配角色"
                        :enterable='false'
                        placement="top-start">
              <el-button type="warning"
                         size="mini"
                         icon="el-icon-star-off"
                         circle></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- page  -->
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="queryInfo.pagenum"
                     :page-sizes="[1, 2, 5, 10]"
                     :page-size="queryInfo.pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
      <!-- add user -->
      <el-dialog title="添加用户"
                 @close="addClose"
                 :visible.sync="addDialogVisible"
                 width="50%">
        <!-- 内容主题 -->
        <el-form :model="addForm"
                 ref="addFormRef"
                 :rules="addFormrules"
                 label-width="70px">
          <el-form-item label="用户名"
                        prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码"
                        prop="password">
            <el-input type="password"
                      v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱"
                        prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机"
                        prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区 -->
        <span slot="footer"
              class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary"
                     @click="addUser">确 定</el-button>
        </span>
      </el-dialog>
      <!-- edit user -->
      <el-dialog title="修改用户"
                 @close="editClose"
                 :visible.sync="editDialogVisible"
                 width="50%">
        <!-- 内容主题 -->
        <el-form :model="editForm"
                 ref="editFormRef"
                 :rules="editFormrules"
                 label-width="70px">
          <el-form-item label="用户名"
                        prop="username">
            <el-input v-model="editForm.username"
                      disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱"
                        prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机"
                        prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区 -->
        <span slot="footer"
              class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary"
                     @click="editUser">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
    <!-- content end -->
  </div>
</template>

<script>
export default {
  data () {
    let checkEmail = (rule, value, callback) => {
      // 验证邮箱的正则表达式
      const regEmail = /^\w+@\w+(\.\w+)+$/
      if (regEmail.test(value)) {
        // 合法邮箱
        return callback()
      }
      // 返回一个错误提示
      callback(new Error('请输入合法的邮箱'))
    }
    let checkMobaile = (rule, value, callback) => {
      // 验证手机号的正则表达式
      const regMobile = /^1[34578]\d{9}$/
      if (regMobile.test(value)) {
        // 合法手机号
        return callback()
      }
      // 返回一个错误提示
      callback(new Error('请输入合法的邮箱'))
    }
    return {
      editForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFormrules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名长度在 3到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 10, message: '密码长度在 3到 10 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, message: '请输入合法邮箱', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobaile, message: '请输入合法手机号', trigger: 'blur' }
        ]

      },
      editFormrules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名长度在 3到 10 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, message: '请输入合法邮箱', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobaile, message: '请输入合法手机号', trigger: 'blur' }
        ]

      },
      addDialogVisible: false,
      editDialogVisible: false,
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      usersList: [],
      // 总数
      total: 0
    }
  },
  created () {
    this.getUsers()
  },
  methods: {
    del (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let { data: res } = await this.$http.delete(`users/${id}`)
        if (res.meta.status === 200) {
          this.getUsers()
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        } else {
          this.$message.error('删除失败')
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    editClose () {
      this.$refs.editFormRef.resetFields()
    },
    async showEditUser (id) {
      this.editDialogVisible = true
      let { data: res } = await this.$http.get(`users/${id}`)
      if (res.meta.status !== 200) return this.$message.error('获取修改信息失败')
      this.$message.success('获取修改信息成功')
      this.editForm.username = res.data.username
      this.editForm.email = res.data.email
      this.editForm.mobile = res.data.mobile
      this.editForm.id = id

    },
    editUser () {
      this.$refs.editFormRef.validate(async valida => {
        if (!valida) return this.$message.error('请输入合法信息')
        // todo axios
        let { data: res } = await this.$http.put(`users/${this.editForm.id}`, this.editForm)
        if (res.meta.status !== 200) return this.$message.error('修改失败')
        this.$message.success('修改成功')
        this.editDialogVisible = false
        this.getUsers()
      })
    },
    // 添加用户事件
    addUser () {
      this.$refs.addFormRef.validate(async valida => {
        if (!valida) return this.$message.error('请输入合法信息')
        // todo axios
        let { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) return this.$message.error('添加失败')
        this.$message.success('添加成功')
        this.addDialogVisible = false
        this.getUsers()
      })
    },
    // 添加用户对话框关闭清空事件
    addClose () {
      this.$refs.addFormRef.resetFields()
    },
    // 监听状态改变事件
    async userChange (userinfo) {
      let { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      if (res.meta.status === 200) {
        this.$message.success('修改状态成功')
      } else {
        this.$message.error('修改状态失败')
        userinfo.mg_state = !userinfo.mg_state
      }

    },
    // 监听pagenum改变事件
    handleCurrentChange (newNum) {
      this.queryInfo.pagenum = newNum
      this.getUsers()
    },
    // pagesize改变事件
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getUsers()
    },
    async getUsers () {
      let { data: res } = await this.$http.get('/users', { params: this.queryInfo })
      if (res.meta.status === 200) {
        this.usersList = res.data.users
        this.total = res.data.total
      } else {
        this.$message.error('获取用户列表失败')
      }

    }
  }
}
</script>

<style lang="less" scoped>
.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}
.el-table {
  margin-top: 15px;
  font-size: 12px;
}
.el-pagination {
  margin-top: 15px;
}
</style>

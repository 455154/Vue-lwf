<template>
  <div>
    <my-header>
      <template slot="two"
                slot-scope="scope">
        <span>
          {{path}}
        </span>
      </template>
      <template slot="tree"
                slot-scope="scope">
        <span>
          {{path2}}
        </span>
      </template>
    </my-header>
    <el-card>
      <!-- // 警告 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数！"
                :closable="false"
                show-icon
                type="warning">

      </el-alert>
      <!-- 分类区 -->
      <el-row>
        <el-col>
          <span>选择商品分类 :</span>
          <el-cascader v-model="formArr"
                       expandTrigger='hover'
                       :options="list"
                       :props="catelist"
                       @change="handleChange"></el-cascader>
        </el-col>
      </el-row>
      <!-- 页签区域 -->
      <el-tabs v-model="activeName"
               @tab-click="handleTabClick">
        <!-- 动态参数页码 -->
        <el-tab-pane label="动态参数"
                     name="only">
          <el-button type="primary"
                     @click="add"
                     :disabled="isdisabled">添加参数</el-button>
          <!-- table -->
          <el-table :data="onlyArr"
                    border
                    stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag @close="tagClose(scope.row,index)"
                        v-for="(item, index) in scope.row.attr_vals"
                        closable
                        type='success'
                        :key="index">{{item}}</el-tag>
                <!-- 添加文本框 按钮 -->
                <el-input class="input-new-tag"
                          v-if="scope.row.inputShow"
                          v-model="scope.row.inputValue"
                          size="small"
                          ref="saveTagInput"
                          @keyup.enter.native="handleInputConfirm"
                          @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else
                           class="button-new-tag"
                           size="small"
                           @click="showInput(scope.row)">+ New Tag</el-button>

              </template>
            </el-table-column>
            <el-table-column type="index"
                             label="编号"></el-table-column>
            <el-table-column prop="attr_name"
                             label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary"
                           icon="el-icon-edit"
                           @click="add('onlyArr',scope.row)"
                           size="mini">编辑</el-button>
                <el-button type="denger"
                           icon="el-icon-delete"
                           @click="del(scope.row)"
                           size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性页码 -->
        <el-tab-pane label="静态属性"
                     name="many">
          <el-button type="primary"
                     @click="add"
                     :disabled="isdisabled">添加属性</el-button>
          <!-- table -->
          <el-table :data="manyArr"
                    border
                    stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag @close="tagClose(scope.row,index)"
                        v-for="(item, index) in scope.row.attr_vals"
                        closable
                        type='success'
                        :key="index">{{item}}</el-tag>
                <!-- 添加文本框 按钮 -->
                <el-input class="input-new-tag"
                          v-if="scope.row.inputShow"
                          v-model="scope.row.inputValue"
                          size="small"
                          ref="saveTagInput"
                          @keyup.enter.native="handleInputConfirm"
                          @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else
                           class="button-new-tag"
                           size="small"
                           @click="showInput(scope.row)">+ New Tag</el-button>

              </template>
            </el-table-column>
            <el-table-column type="index"
                             label="编号"></el-table-column>
            <el-table-column prop="attr_name"
                             label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary"
                           icon="el-icon-edit"
                           @click="add('manyArr',scope.row)"
                           size="mini">编辑</el-button>
                <el-button type="denger"
                           icon="el-icon-delete"
                           @click="del(scope.row)"
                           size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加对话框 -->
    <el-dialog :title="title+getTitle"
               :visible.sync="dialogVisible"
               @close="dialogClose"
               width="60%">
      <el-form :model="addForm"
               :rules="addRules"
               ref="ruleFormRef"
               label-width="100px"
               class="demo-ruleForm">
        <el-form-item prop="attr_name"
                      :label="getTitle">
          <el-input v-model="addForm.attr_name"
                    clearable
                    placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="addSet">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import mycommon from '../mycommon.vue'
let Header;
export default {
  data () {
    return {
      path: '商品分类',
      path2: '分类参数',
      // 获取列表
      list: [],
      // 级联选择框 元素配置
      catelist: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 级联框双向绑定的数据
      formArr: [],
      // 被激活的页签的名称
      activeName: 'only',
      // 动态数据
      onlyArr: [],
      // 静态属性数据
      manyArr: [],
      // 添加对话框flag
      dialogVisible: false,
      addForm: {
        attr_name: ''
      },
      addRules: {
        attr_name: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ]
      },
      // 添加 / 编辑对话框 标题
      title: '添加',
      // 编辑 ID
      modifyId: ''
    }
  },
  created () {
    this.get()
  },
  methods: {
    // 点击按钮 展示文本输入框
    showInput (row) {
      console.log(row);
      row.inputShow = true;
      // 刷新页面后 第一点击 $refs 为空
      // 获得焦点  $nextTick 当页面重新渲染后会执行回调函数
      this.$nextTick(_ => {
        // todo 原本无默认标签的 点击添加报错
        console.log(this.$refs);

        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 文本框失去焦点 Î
    async  handleInputConfirm (row) {
      // if (inputValue) {
      //   this.dynamicTags.push(inputValue);
      // }
      console.log(row.inputValue.trim());
      if (!row.inputValue.trim()) {
        row.inputValue = ''
        row.inputShow = false;
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputShow = false;
      console.log(this.activeName);

      let { data: res } = await this.$http.put(`categories/${this.getId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: this.activeName,
        attr_vals: row.attr_vals.join(',')
      })
      if (res.meta.status !== 200) return this.$message.error('获取失败')
      this.$message.success('修改成功')

    },
    // 删除对应标签 
    async tagClose (row, i) {
      console.log(row);
      let { data: res } = await this.$http.put(`categories/${this.getId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: this.activeName,
        attr_vals: row.attr_vals.splice(i, 1)
      })
      if (res.meta.status !== 200) return this.message.error('获取失败')

    },
    // 删除确认 
    del (row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let { data: res } = await this.$http.delete(`categories/${this.getId}/attributes/${row.attr_id}`)
        if (res.meta.status !== 200) return this.$message.error('获取失败')
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
        this.dialogVisible = false
        this.dialogClose()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 添加确认
    addSet () {
      this.$refs.ruleFormRef.validate(async valid => {
        if (!valid) return this.$message.error('失败')
        if (this.title === '添加') {
          let { data: res } = await this.$http.post(`categories/${this.formArr[2]}/attributes`, { attr_name: this.addForm.attr_name, attr_sel: this.activeName })
          if (res.meta.status !== 201) return this.$message.error('获取失败')
        } else {
          let { data: res } = await this.$http.put(`categories/${this.getId}/attributes/${this.modifyId}`, { attr_name: this.addForm.attr_name, attr_sel: this.activeName })
          if (res.meta.status !== 200) return this.$message.error('获取失败')

        }
        this.dialogVisible = false
        this.dialogClose()

      })

    },
    // 添加对话框关闭
    dialogClose () {
      // 清空表单
      this.$refs.ruleFormRef.resetFields()
      this.getCategories()
    },
    // 添加属性 / 参数
    async add (sel, row) {
      if (typeof sel === 'string') {
        this.title = '编辑'
        // 赋值 
        console.log(row);
        this.addForm.attr_name = row.attr_name
        let { data: res } = await this.$http.get(`categories/${this.getId}/attributes/${row.attr_id}`, {
          params: {
            attr_sel: sel
          }
        })
        if (res.meta.status !== 200) return this.$message.error('获取失败')
        console.log(res);
        this.addForm = res.data
        this.modifyId = row.attr_id
      } else {
        this.title = '添加'
      }
      this.dialogVisible = true
    },
    // 页签点击事件
    handleTabClick () {
      this.getCategories()
    },
    // 级联选择变化后 得到对应数据 渲染 
    // 同时 改变 value 属性
    // 同时 添加 inputValue 属性为 ''
    async getCategories () {
      let { data: res } = await this.$http.get(`categories/${this.getId}/attributes`, { params: { sel: this.activeName } })
      if (res.meta.status !== 200) return this.$message.error('获取失败')
      // todo 可能受影响部分
      res.data.forEach(item => {
        item.inputValue = ''
        if (!item.attr_vals) return
        console.log(item.attr_vals);
        item.attr_vals = item.attr_vals.split(',')
        // 添加一个布尔值 控制文本框显示和隐藏
        item.inputShow = false
        console.log(item.attr_vals + '====');

        // 控制文本框内容
      })
      console.log(res.data);

      if (this.activeName === 'only') this.onlyArr = res.data
      if (this.activeName === 'many') this.manyArr = res.data

    },
    // 级联选择框变化触发
    handleChange () {
      // 判断选中内容是否为三级
      if (this.formArr.length !== 3) {
        this.formArr = []
        this.onlyArr = this.manyArr = []
      }
      this.getCategories()
    },
    async get () {
      let { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error('获取失败')
      this.list = res.data
    }
  },
  components: {
    'my-header': mycommon
  },
  computed: {
    isdisabled () {
      if (this.formArr.length === 3) {
        return false
      }
      return true
    },
    // 三级分类 ID
    getId () {
      if (this.formArr.length === 3) return this.formArr[this.formArr.length - 1]
      return null
    },
    // 对话框标题
    getTitle () {
      if (this.activeName === 'only') return '动态参数'
      return '静态属性'
    }
  }
}
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 15px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}
.el-row {
  margin: 15px 0;
}
.el-table {
  width: 100%;
}
.input-new-tag {
  width: 120px;
}
</style>

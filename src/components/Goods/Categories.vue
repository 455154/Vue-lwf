<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 面包屑  End-->
    <!-- 卡片 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="info"
                     @click="showAddDialog">
            添加分类
          </el-button>
        </el-col>
      </el-row>
      <!-- table区域 -->
      <el-row class="table">
        <tree-table :data="classList"
                    :selection-type='false'
                    :expand-type='false'
                    :show-index="true"
                    stripe
                    border
                    :show-row-hover="false"
                    index-text="编号"
                    :columns="columns">

          <template slot="is-pid"
                    slot-scope="scope">
            <i class="el-icon-error"
               style="color:red"
               v-if="scope.row.cat_pid"></i>
            <i class="el-icon-success"
               style="color:lightgreen"
               v-else></i>
          </template>
          <template slot="is-order"
                    slot-scope="scope">
            <el-tag v-if="scope.row.cat_level == 0">一级</el-tag>
            <el-tag type="success"
                    v-if="scope.row.cat_level == 1">二级</el-tag>
            <el-tag type="danger"
                    v-if="scope.row.cat_level == 2">三级</el-tag>
          </template>
          <template slot="operating"
                    slot-scope="scope">
            <el-button icon="el-icon-search"
                       size="mini"
                       circle></el-button>
            <el-button type="warning"
                       size="mini"
                       icon="el-icon-star-off"
                       circle></el-button>
            <el-button type="danger"
                       size="mini"
                       icon="el-icon-delete"
                       circle></el-button>
          </template>

        </tree-table>
      </el-row>
      <!-- table End -->
      <!-- 页码 -->
      <el-pagination class="table"
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="categories.pagenum"
                     :page-sizes="[1, 2, 5, 10]"
                     :page-size="categories.pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
      <!-- 页码 End -->
    </el-card>
    <!-- 卡片End -->
    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类"
               :visible.sync="isshowAddDialog"
               width="80%"
               @close="addClose"
               :before-close="handleClose">
      <!-- 表单 -->
      <el-form :model="addCategor"
               ref="addFormRef"
               label-width="100px"
               :rules="addRules"
               class="demo-dynamic">
        <el-form-item label="分类名称"
                      prop="cat_name">
          <el-input v-model="addCategor.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader v-model="selectKeys"
                       :clearable="true"
                       :options="parentClass"
                       :props="caseProps"
                       :change-on-select='true'
                       @change="parentChange"></el-cascader>
        </el-form-item>

      </el-form>
      <!-- 表单 END -->
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="isshowAddDialog = false">取 消</el-button>
        <el-button type="primary"
                   @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data () {
    return {
      // 发送分类请求的数据 
      categories: {
        type: '',
        pagenum: 1,
        pagesize: 5
      },
      // 请求过来的分类数据
      classList: [],
      // 数据 总个数
      total: 0,
      // 表格各项配置
      columns: [
        { label: '分类名称', prop: 'cat_name' },
        { label: '是否有效', type: 'template', template: 'is-pid' },
        { label: '排序', type: 'template', template: 'is-order' },
        { label: '操作', type: 'template', template: 'operating' }
      ],
      currentPage4: {

      },
      // 添加对话框状态控制
      isshowAddDialog: false,
      // 添加表单绑定事件
      addCategor: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      // add验证规则
      addRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 父级分类列表
      parentClass: [],
      // prop配置对象
      caseProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'

      },
      // 级联选择绑定
      selectKeys: []
    }
  },
  created () {
    this.getCategories()
  },
  methods: {
    // 添加对话框关闭
    addClose () {
      // 清空所有数据
      this.selectKeys = []
      this.addCategor = {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      }
      this.$refs.addFormRef.resetFields()
    },
    // 点击添加分类
    async addCate () {
      // todo
      console.log(this.$refs.addFormRef);
      console.log(this.addCategor);
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error('失败')
        console.log(this.addCategor);
        let { data: res } = await this.$http.post(`categories`, this.addCategor)
        console.log(this.addCategor);
        this.isshowAddDialog = false
        if (res.meta.status !== 201) return this.$message.error('添加失败')
        this.$message.success('添加成功')
        this.getCategories()
      })
    },
    // 联级选择 选择项变化 触发
    parentChange () {
      // 父级分类 id
      if (this.selectKeys.length > 0) {
        this.addCategor.cat_pid = this.selectKeys[this.selectKeys.length - 1]
        // 当前分类等级
        this.addCategor.cat_level = this.selectKeys.length
        return
      }
      //  否则 取 0
      this.addCategor.cat_pid = this.addCategor.cat_level = 0
    },
    // 获取父级分类
    async getParentsClass () {
      let { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) return this.message.error('获取失败')
      console.log(res.data);
      this.parentClass = res.data
    },
    // 对话框关闭之前事件
    handleClose () {

    },
    // 添加分类
    showAddDialog () {
      this.getParentsClass()
      this.isshowAddDialog = true

    },
    // pagesize改变事件
    handleSizeChange (newSize) {
      this.categories.pagesize = newSize
      this.getCategories()

    },
    // pagenum改变事件
    handleCurrentChange (newNum) {
      this.categories.pagenum = newNum
      this.getCategories()

    },
    // 获取分类数据
    async getCategories () {
      let { data: res } = await this.$http.get('categories', { params: this.categories })
      if (res.meta.status !== 200) return this.$message.error('获取失败')
      console.log(res.data);
      this.classList = res.data.result
      this.total = res.data.total
    }
  }
}
</script>

<style lang="less" scoped>
.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}
.table {
  margin-top: 20px;
}
.el-cascader {
  width: 100%;
}
</style>

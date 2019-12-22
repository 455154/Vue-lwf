<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 面包屑  End-->
    <!-- 卡片 -->
    <el-card>
      <!-- 警告 -->
      <el-alert title="添加商品信息"
                center
                :closable="false"
                show-icon
                type="info">
      </el-alert>
      <!-- 警告 END -->
      <!-- 步骤条 -->
      <el-steps :space="200"
                :active="Index-''"
                align-center
                finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 步骤条 END -->
      <el-form :model="addForm"
               ref="addRef"
               :rules="addRules"
               label-position="top">
        <!-- 左侧导航 -->
        <el-tabs :tab-position="tabPosition"
                 :before-leave="totaggle"
                 @tab-click="tabstoggle"
                 v-model="Index">
          <el-tab-pane label="基本信息"
                       name='0'>
            <!--  item 1 -->
            <el-form-item prop="goods_name"
                          label="商品名称">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item prop="goods_price"
                          type="number"
                          label="商品价格">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item prop="goods_weight"
                          type="number"
                          label="商品重量">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item prop="goods_number"
                          type="number"
                          label="商品数量">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item prop="goods_cat"
                          label="商品分类">
              <!-- 级联选择器 -->
              <el-cascader v-model="addForm.goods_cat"
                           :options="goodsList"
                           expand-trigger="hover"
                           :props="catelist"
                           @change="handleChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数"
                       name='1'>
            <el-form-item :label="item.attr_name"
                          v-for="(item) in manyArr"
                          :key="item.id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="item2"
                             v-for="(item2, i) in item.attr_vals"
                             :key="i"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>

          </el-tab-pane>
          <el-tab-pane label="商品属性"
                       name='2'>
            <el-form-item :label='item.attr_name'
                          v-for="(item) in onlyArr"
                          :key="item.attr_id">
              <el-input v-model="item.attr_vals"
                        type="text"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片"
                       name='3'>
            <el-button type="primary">图片上传</el-button>
            <el-upload action="http://127.0.0.1:8888/api/private/v1/upload"
                       list-type="picture-card"
                       :headers="headers"
                       :on-success="upsuccess"
                       :on-preview="handlePictureCardPreview"
                       :on-remove="handleRemove">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%"
                   :src="dialogImageUrl"
                   alt="">
            </el-dialog>
          </el-tab-pane>
          <el-tab-pane label="商品内容"
                       name='4'>
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button class="mtop"
                       @click="addConfrim"
                       type="primary">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
        <!-- 左侧导航 END -->
      </el-form>

    </el-card>
    <!-- 卡片 END-->
  </div>
</template>

<script>
export default {
  data () {
    return {
      catelist: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 表单规则
      addRules: {
        goods_name: [{ required: true, message: '请填写内容', trigger: 'blur' }],
        goods_cat: [{ required: true, message: '请填写内容', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请填写内容', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请填写内容', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请填写内容', trigger: 'blur' }]
      },
      // 基本信息 Form
      addForm: {
        goods_name: '',
        goods_cat: [],
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_introduce: '',
        pics: [],
        attrs: []
      },
      // 显示的步骤
      Index: 0,
      // 导航栏的显示方式
      tabPosition: 'left',
      // 商品分类列表
      goodsList: [],
      // 动态参数列表数据 
      manyArr: [],
      // 
      onlyArr: [],
      // 上传图片预览框 
      dialogVisible: false,
      // 图片预览地址
      dialogImageUrl: '/',
      // 上传图片配置token
      headers: {
        Authorization: window.sessionStorage.getItem('token')
      }
    }
  },
  created () {
    this.getGoodsList()

  },
  methods: {
    // add 
    addConfrim () {
      // // todo 与验证
      console.log(1);
      this.$refs.addRef.validate(async valid => {
        if (!valid) return this.$message.error('失败')
        // todo 无报错. 视频使用lodash 的 _.cloneDeep()进行深拷贝
        this.onlyArr.forEach(item => {
          let obj = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(obj)
        }
        )
        this.manyArr.forEach(item => {
          let obj = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(',')
          }
          this.addForm.attrs.push(obj)
        })
        console.log(this.addForm);
        this.addForm.goods_cat = this.addForm.goods_cat.join(',')
        let { data: res } = await this.$http.post(`goods`, this.addForm)
        if (res.meta.status !== 201) return this.$message.error('获取失败')

        this.$router.push('/goods')
      })
    },
    // 上传成功的钩子函数
    upsuccess (res, file, files) {
      this.addForm.pics.push({ pic: '/' + res.data.tmp_path })
      this.dialogImageUrl = res.data.url
      console.log(this.addForm.pics);
    },
    // 图片查看事件
    handlePictureCardPreview () {
      this.dialogVisible = true
    },
    // 图片删除事件
    handleRemove (file, fileList) {
      console.log(file, fileList);
      let path = '/' + file.response.data.tmp_path
      let i = this.addForm.pics.findIndex(x => x.pic === path)
      this.addForm.pics.splice(i, 1)

    },
    // 切换点击事件
    async tabstoggle () {
      // console.log(a);
      // console.log(b);
      console.log(this.Index);

      if (this.Index === '1') {
        console.log('ok');
        let { data: res } = await this.$http.get(`categories/${this.addForm.goods_cat[2]}/attributes`, {
          params: {
            sel: 'many'
          }
        })
        if (res.meta.status !== 200) return this.message.error('获取失败')
        res.data.forEach(item => {
          if (!item.attr_vals) return item.attr_vals = []
          item.attr_vals = item.attr_vals.split(' ')
        });
        this.manyArr = res.data
        console.log(this.manyArr);
      }
      if (this.Index === '2') {
        console.log('ok');
        let { data: res } = await this.$http.get(`categories/${this.addForm.goods_cat[2]}/attributes`, {
          params: {
            sel: 'only'
          }
        })
        if (res.meta.status !== 200) return this.message.error('获取失败')
        // res.data.forEach(item => {
        //   if (!item.attr_vals) return item.attr_vals = []
        //   item.attr_vals = item.attr_vals.split(' ')
        // });
        this.onlyArr = res.data
        console.log(this.onlyArr);
      }
    },
    // 左侧导航栏切换判断事件
    totaggle (b, a) {
      if (a === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请选择分类')
        return false
      }
    },
    // 级联选择框 change 事件
    handleChange () {
      if (this.addForm.goods_cat.length !== 3) this.addForm.goods_cat = []

    },
    async getGoodsList () {
      let { data: res } = await this.$http.get(`categories`)
      if (res.meta.status !== 200) return this.message.error('获取失败')
      this.goodsList = res.data
    }
  }
}
</script>

<style lang="less" scoped>
.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}
.el-alert {
  text-align: center;
}
.el-steps {
  margin: 15px 0;
}
.el-step__title {
  font-size: 13px;
}
.quill-editor {
  height: 300px;
}
.mtop {
  margin-top: 90px;
}
</style>

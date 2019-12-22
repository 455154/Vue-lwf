<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 面包屑  End-->
    <!-- 卡片 -->
    <el-card>
      <!-- 搜索 添加 栏 -->
      <el-row :gutter='20'>
        <el-col :span="8">
          <el-input placeholder="请输入内容"
                    clearable
                    @clear="search"
                    v-model="gets.query">
            <el-button slot="append"
                       @click="search"
                       icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span='4'>
          <el-button type="primary"
                     @click="goAddGoods">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 搜索 添加 栏 END -->
      <!-- Table -->
      <el-row>
        <el-table :data="goodsList">
          <el-table-column type="index"></el-table-column>
          <el-table-column label="商品名称"
                           prop="goods_name"></el-table-column>
          <el-table-column width="95px"
                           label="商品价格(元)"
                           prop="goods_price"></el-table-column>
          <el-table-column label="商品重量"
                           width="160px"
                           prop="goods_weight"></el-table-column>
          <el-table-column label="创建时间"
                           width="180px"
                           prop="add_time">
            <template slot-scope="scope">
              {{scope.row.add_time | dateFilter}}
            </template></el-table-column>
          <el-table-column label="操作"
                           width="130px">
            <template slot-scope="scope">

              <el-button type="primary"
                         icon="el-icon-edit"
                         @click="goAddGoods"
                         circle></el-button>

              <el-popconfirm title="确定要删除吗"
                             @onConfirm="del(scope.row)">
                <el-button>11111</el-button>
                <el-button type="danger"
                           slot="reference"
                           icon="el-icon-delete"
                           circle></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <!-- Table END -->
      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="gets.pagenum"
                     :page-sizes="[5, 10, 20, 50]"
                     :page-size="gets.pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>

export default {
  data () {
    return {
      // 获取商品数据的对象数据
      gets: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      // 商品数据列表  
      goodsList: [],
      // 商品总数
      total: 0
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    // 添加跳转
    goAddGoods () {
      this.$router.push('/goods/add')
    },
    // 编辑 
    modify () {

    },
    // 删除
    async del (row) {
      console.log(1);
      let { data: res } = await this.$http.delete(`goods/${row.goods_id}`)
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      this.$message.success('删除成功')
      this.getGoodsList()

    },
    // 搜索
    search () {
      this.getGoodsList()
    },
    // 
    handleSizeChange (newpagesize) {
      this.gets.pagesize = newpagesize
      this.getGoodsList()

    },
    // 
    handleCurrentChange (newpagenum) {
      this.gets.pagenum = newpagenum
      this.getGoodsList()

    },
    // 获取商品数据
    async getGoodsList () {
      let { data: res } = await this.$http.get(`goods`, { params: this.gets })
      if (res.meta.status !== 200) return this.message.error('获取失败')
      console.log(res.data.goods[0]);
      this.goodsList = res.data.goods
      this.total = res.data.total
    }
  }
}
</script>

<style lang="less" scoped>
.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}
.el-pagination {
  background-color: rgba(135, 207, 235, 0.062);
  margin-top: 25px;
}
</style>

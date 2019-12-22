<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 面包屑  End-->
    <!-- 卡片 -->
    <el-card>
      <!-- 搜索 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容"
                    v-model="input"
                    class="input-with-select">
            <el-button slot="append"
                       icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-row>
        <el-col>
          <el-table :data="list"
                    border
                    stripe>
            <el-table-column type="index">

            </el-table-column>
            <el-table-column label="订单编号"
                             prop="order_number">

            </el-table-column>
            <el-table-column label="订单价格"
                             prop="order_price">

            </el-table-column>
            <el-table-column label="是否付款"
                             prop="pay_status">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.pay_status == 0">未付款</el-tag>
                <el-tag type="warning"
                        v-else>已付款</el-tag>
              </template>

            </el-table-column>
            <el-table-column label="是否发货"
                             prop="is_send">

            </el-table-column>
            <el-table-column label="下单时间"
                             prop="create_time">
              <template slot-scope="scope">
                {{scope.row.create_time | dateFilter}}
              </template>

            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="info"
                           icon="el-icon-edit"
                           @click="dialog(scope.row)"
                           circle></el-button>
                <el-button type="primary"
                           icon="el-icon-s-promotion"
                           @click="logistics(scope.row)"
                           circle></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <!-- 分页 -->
      <el-row>
        <el-col>
          <el-pagination @size-change="handleSizeChange"
                         @current-change="handleCurrentChange"
                         :current-page="params.pagenum"
                         :page-sizes="[3, 5, 10, 20]"
                         :page-size="params.pagesize"
                         layout="total, sizes, prev, pager, next, jumper"
                         :total="total">
          </el-pagination>
        </el-col>
      </el-row>
    </el-card>
    <!-- 卡片 END -->
    <!-- 地址对话框 -->

    <el-dialog title="地址"
               :visible.sync="dialogVisible"
               width="50%"
               @close="closeDialog"
               :before-close="handleClose">
      <el-form :data="dialogList"
               ref="dialogRef"
               :rules='Rules'>
        <el-form-item label="省市区/县"
                      lable-width="100px"
                      prop="dia1">
          <el-cascader :options="city"
                       v-model="dialogList.dia1">

          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址"
                      prop="dia2"
                      lable-width="100px">
          <el-input width="300px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 物流对话框 -->
    <el-dialog title="物流消息"
               :visible.sync="showLogistics"
               width="50%"
               :before-close="showHanldeClose">
      <!-- 时间线 -->
      <el-timeline :reverse="false">
        <el-timeline-item v-for="(activity, index) in logisticsList"
                          :key="index"
                          :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="showLogistics = false">取 消</el-button>
        <el-button type="primary"
                   @click="showLogistics = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import city from './citydata'
export default {
  data () {
    return {
      // 搜索框绑定内容
      input: '',
      // 请求参数
      params: {
        query: '',
        pagenum: 1,
        pagesize: 5,
        user_id: '',
        pay_status: '',
        is_send: '',
        order_fapiao_title: '',
        order_fapiao_company: '',
        order_fapiao_content: '',
        consignee_addr: ''
      },
      // 数据列表
      list: [],
      // 总数
      total: 0,
      // 地址对话框开关
      dialogVisible: false,
      // todo 地址对话框 X 无效
      // 地址对话框数据
      dialogList: {
        dia1: [],
        dia2: ''
      },
      // 地址对话框 Form 验证
      Rules: {
        dia1: [{ required: true, message: '请选择内容', trigger: 'blur' }],
        dia2: [{ required: true, message: '请填写内容', trigger: 'blur' }]

      },

      // city 数据
      city,
      // 物流对话框开关
      showLogistics: false,
      // 物流信息
      logisticsList: []

    }
  },
  created () {
    this.get()
  },
  methods: {
    // 物流对话框
    async logistics (row) {
      console.log(row);

      let { data: res } = await this.$http.get(`/kuaidi/1106975712662`)
      if (res.meta.status !== 200) return this.message.error('获取失败')
      this.logisticsList = res.data
      console.log(res.data)

      console.log(res.meta)

      this.showLogistics = true
    },
    showHanldeClose () {

    },
    // 地址对话框 
    dialog (row) {
      console.log(row);
      this.dialogList = row
      this.dialogVisible = true
    },
    handleClose () {

    },
    closeDialog () {
      this.$refs.dialogRef.resetFields()
    },
    confirm () {
      console.log(1);
      this.dialogVisible = false
    },
    // 页码
    handleSizeChange (size) {
      this.params.pagesize = size
      this.get()

    },
    handleCurrentChange (num) {
      this.params.pagenum = num
      this.get()


    },
    async get () {
      let { data: res } = await this.$http.get(`orders`, { params: this.params })
      if (res.meta.status !== 200) return this.$message.error('获取失败')
      console.log(res.data.goods[0])
      this.list = res.data.goods
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
  margin-top: 20px;
}
.el-cascader {
  width: 100%;
}
</style>

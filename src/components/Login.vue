<template>
  <div class="login_container">
    <div class="login_box">
      <!-- logo -->
      <div class="avatar_box">
        <img src="../assets/logo.png"
             alt="">
      </div>

      <!-- logo end   prop 对应规则 rules 绑定规则属性 ref是我们绑定的对象 
      :model="ruleForm" 是绑定我们form表单中需要提交给后台的一个对象-->
      <el-form id="form"
               status-icon
               ref="ruleForm"
               :model="ruleForm"
               :rules="rules"
               label-width="100px"
               class="demo-ruleForm">
        <el-form-item label="用户名"
                      prop="username">
          <el-input type="text"
                    prefix-icon="el-icon-user-solid"
                    v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码"
                      prop="password">
          <el-input type="password"
                    prefix-icon="el-icon-lock"
                    v-model="ruleForm.password"></el-input>
        </el-form-item>
        <el-form-item id="btns">
          <el-button type="primary"
                     @click="Submie">提交</el-button>
          <el-button @click="Reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      ruleForm: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, min: 3, max: 10, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名长度在 3到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, min: 3, max: 10, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 10, message: '密码长度在 3到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    Reset () {
      // this.ruleForm.username = this.ruleForm.password = ''
      // 组件给定的重置方式 $refs.ruleForm 绑定额 form 对象
      this.$refs.ruleForm.resetFields()
    },
    Submie () {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          let { data: res } = await this.$http.post('/login', this.ruleForm)
          console.log(res);
          if (res.meta.status === 200) {
            // 保存 token 到 session
            window.sessionStorage.setItem("token",res.data.token)
            this.$message({
              message: '恭喜您，登录成功',
              type: 'success'
            })
            this.$router.push('/home')
          } else {
            this.$message({
              message: '账号或密码错误',
              type: 'error'
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: skyblue;
  height: 100%;
}
.login_box {
  position: relative;
  min-width: 500px;
  max-width: 600px;
  min-height: 300px;
  width: 40%;
  height: 40%;
  background-color: #fff;
  border-radius: 10%;
  #form {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 15px;
    width: 85%;
    padding-right: 30px;
    #btns {
      display: flex;
      margin-left: -70px;
      justify-content: space-between;
    }
  }
}
.avatar_box {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -45%);
  width: 150px;
  height: 150px;
  border-radius: 50%;
  padding: 10px;
  border: 1px solid #eee;
  box-shadow: 0 0 10px #ddd;
  background-color: #fff;
  img {
    background-color: #ddd;
    border-radius: 50%;
    width: 100%;
    height: 100%;
  }
}
</style>

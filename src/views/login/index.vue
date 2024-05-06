<template>
  <div class="login-page">
    <el-card class="login-card">
      <template #header>黑马面经运营后台</template>

      <!-- 表单
           1. el-form组件：包裹整个表单范围 (表单的整体)
           2. el-form-item组件：表单域 (表单的一行)
           3. el-input组件：输入框组件
           4. el-button组件：按钮组件

           表单校验：
           1. el-form: model & rules
              model 绑定的是一个form对象，集中收集管理整个表单的数据 (将来校验也会方便)
              rules 绑定的是规则列表，
              格式：
              {
                字段名1: [ {}, {} ],
                字段名2: [ {}, {} ],
              }

           2. el-form-item: 绑定 prop 属性 → 指定应用哪个字段规则

           3. el-input: 绑定 v-model → 收集表单数据
      -->
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="用户名：" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入用户密码"></el-input>
        </el-form-item>
        <el-form-item class="tc">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'LoginIndex',
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          // 1. required 非空校验
          // 2. message 错误提示
          // 3. trigger 触发校验的时机 blur 失焦的时候触发，change 输入框值改变的时候触发
          // 4. min 长度最小值，max 长度最大值
          // 5. pattern 正则校验
          { required: true, message: '请输入用户名', trigger: ['blur', 'change'] },
          { min: 5, max: 11, message: '长度在 5~11 个字符', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: ['blur', 'change'] },
          { pattern: /^\w{5,11}$/, message: '长度在 5~11 个字符', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    async login () {
      // 登录时，需要先校验，校验通过才能发请求
      // 校验：通过 ref 和 $refs 拿到 el-form 组件，调用组件的校验方法
      // console.log(this.$refs.form)
      try {
        await this.$refs.form.validate()
        // 调用action(异步) async函数的调用会返回一个promise
        await this.$store.dispatch('user/loginAction', this.form)
        this.$message.success('恭喜登录成功')
        this.$router.push('/')
      } catch (e) {
        console.log(e)
      }
    },
    reset () {
      // 点击重置，重置表单
      // 重置：通过 ref 和 $refs 拿到 el-form 组件，调用组件的重置方法
      this.$refs.form.resetFields()
    }
  }
}

</script>

<style lang="scss" scoped>
// scoped加上后，所有的样式，只会作用于当前组件模板
// 但是：有时候我们也需要向下渗透，影响到组件内部的一些内容样式 → 深度作用选择器
// (1) less  /deep/ 选择器前面添加 /deep/
// (2) scss  ::v-deep 选择器前面加上 ::v-deep
.login-page {
  min-height: 100vh;
  background: url(@/assets/login-bg.svg) no-repeat center / cover;
  display: flex;
  align-items: center;
  justify-content: center;
  .el-card {
    width: 420px;
    ::v-deep .el-card__header{
      height: 80px;
      line-height: 40px;
      background: rgba(114,124,245,1);
      text-align: center;
      color: #fff;
      font-size: 18px;
    }
  }
  .el-form {
    padding: 0 20px;
  }
  .tc {
    text-align: center;
  }
}
</style>

<template>
  <el-container class="layout-page">
    <!-- 侧边栏菜单 -->
    <el-aside width="200px">
      <div class="logo">黑马面经</div>
      <el-menu
        router
        :default-active="$route.path"
        background-color="#313a46"
        text-color="#8391a2"
        active-text-color="#FFF"
      >
        <el-menu-item index="/dashboard">
          <i class="el-icon-pie-chart"></i>
          <span>数据看板</span>
        </el-menu-item>
        <el-menu-item index="/article">
          <i class="el-icon-notebook-1"></i>
          <span>面经管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <!-- 主体头部 -->
      <el-header>
        <div class="user">
          <el-avatar
            :size="36"
            :src="avatar"
          ></el-avatar>
          <el-link :underline="false">{{name}}</el-link>
        </div>
        <div class="logout">
          <!-- 退出功能 -->
          <el-popconfirm title="您确认退出黑马面运营后台吗？" @confirm="handleConfirm">
            <i slot="reference" title="logout" class="el-icon-switch-button"></i>
          </el-popconfirm>
        </div>
      </el-header>

      <!-- 主体切换区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { getUser } from '@/api/user'
export default {
  name: 'layout-page',
  data () {
    return {
      avatar: '',
      name: ''
    }
  },
  created () {
    this.initData()
  },
  methods: {
    async initData () {
      // 请求获取个人信息，用于右上角的渲染
      const { data } = await getUser()
      this.avatar = data.avatar
      this.name = data.name
    },
    handleConfirm () {
      // 1. 清空vuex和本地的token存储
      this.$store.commit('user/logout')
      // 2. 跳转到登录页
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="scss" scoped>
.layout-page {
  height: 100vh;
  .el-aside {
    background: #313a46;
    .logo {
      color: #fff;
      font-size: 20px;
      height: 60px;
      line-height: 60px;
      text-align: center;
    }
    .el-menu {
      border-right: none;
      margin-top: 20px;
      &-item {
        background-color: transparent !important;
        > span, i {
          padding-left: 5px;
        }
      }
    }
  }
  .el-header {
    box-shadow: 0px 0px 35px 0px rgba(154, 161, 171, 0.15);
    background: #fff;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    z-index: 999;
    .user {
      display: flex;
      align-items: center;
      background: #fafbfd;
      height: 60px;
      border: 1px solid #f1f3fa;
      padding: 0 15px;
      .el-avatar {
        margin-right: 15px;
      }
    }
    .logout {
      font-size: 20px;
      color: #999;
      cursor: pointer;
      padding: 0 15px;
    }
  }
  .el-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #aaa;
    border-top: 1px solid rgba(152, 166, 173, 0.2);
    font-size: 14px;
  }
}
</style>

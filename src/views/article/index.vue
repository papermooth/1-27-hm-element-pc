<template>
  <div class="article-page">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>面经后台</el-breadcrumb-item>
      <el-breadcrumb-item>面经管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 整体的面板部分 -->
    <el-card shadow="never" border="false">
      <!-- 面板头部部分 -->
      <template #header>
        <div class="header">
          <span>共 {{ total }} 条记录</span>

          <el-button
            @click="openDrawer('add')"
            icon="el-icon-plus"
            size="small"
            type="primary"
            round>
            添加面经
          </el-button>
        </div>
      </template>

      <!-- 面板主体部分 - 表格 -->
      <!--
        el-table 整个表格组件
          data 配置数据源
        el-table-column 列组件
          prop 配置数据，配置对象中的属性名
          label 表格的列名
          width 表格的宽度
       -->
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column prop="stem" label="标题" width="400"></el-table-column>
        <el-table-column prop="creator" label="作者"></el-table-column>
        <el-table-column prop="likeCount" label="点赞"></el-table-column>
        <el-table-column prop="views" label="浏览数"></el-table-column>
        <el-table-column prop="createdAt" label="更新时间"></el-table-column>
        <el-table-column label="编辑">
          <!-- 通过作用域插槽：提供了 $index下标，row当前行的数据，row.id row.stem -->
          <template #default="obj">
            <div class="actions">
              <i @click="openDrawer('preview', obj.row.id)" class="el-icon-view"></i>
              <i @click="openDrawer('edit', obj.row.id)" class="el-icon-edit-outline"></i>
              <i @click="del(obj.row.id)" class="el-icon-delete"></i>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页容器的位置
           @size-change 监听每页条数的变化
           @current-change 监听当前页的变化
           :page-sizes 可供选择的每页条数下拉菜单
           :page-size 设置当前生效的【每页条数】
           :current-page 设置当前生效的【当前页】
           :total  设置【总条数】
           background 按钮底色
      -->
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page="current"
        :page-size="pageSize"
        :total="total"
        layout="prev, pager, next"
      >
      </el-pagination>
    </el-card>

    <!-- 抽屉区域
         1. title="我是标题"
         2. :visible 控制显示隐藏
         3. :direction="direction"  控制方向
         4. :before-close="handleClose" 关闭抽屉前的处理逻辑
            (比如：询问客户是否真的要关闭？)
         5. size="60%" 窗体所占的区域多宽
    -->
    <el-drawer
      :title="drawerTitle"
      :visible.sync="isShowDrawer"
      direction="rtl"
      :before-close="handleClose"
      size="60%"
    >
      <!-- 只有添加和编辑需要表单 / 预览不需要表单 -->
      <div v-if="drawerType === 'preview'" class="article-preview">
        <h5>{{ form.stem }}</h5>
        <div v-html="form.content"></div>
      </div>

      <el-form v-else ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="stem">
          <el-input v-model="form.stem" placeholder="请输入面经标题"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <quill-editor @blur="$refs.form.validateField('content')" v-model="form.content"></quill-editor>
        </el-form-item>
        <el-form-item>
          <el-button @click="submit" type="primary">确认</el-button>
          <el-button @click="handleClose">取消</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script>
import { createArticle, getArticleDetail, getArticleList, removeArticle, updateArticle } from '@/api/article'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'

export default {
  name: 'article-page',
  data () {
    return {
      tableData: [],
      current: 1, // 当前页
      pageSize: 5, // 每页条数
      total: 0,
      isShowDrawer: false, // 控制抽屉的展示
      drawerType: 'add', // 默认认为是添加框，add preivew edit
      form: {
        stem: '', // 标题
        content: '' // 内容
      },
      rules: {
        stem: [
          { required: true, message: '请输入标题内容', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入文章内容', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.initData()
  },
  components: {
    quillEditor
  },
  computed: {
    drawerTitle () {
      let title = '标题'

      if (this.drawerType === 'add') title = '添加面经'
      if (this.drawerType === 'preview') title = '面经预览'
      if (this.drawerType === 'edit') title = '修改面经'

      return title
    }
  },
  methods: {
    // 共用的打开抽屉的方法
    async openDrawer (type, id) {
      this.drawerType = type
      this.isShowDrawer = true
      // 添加/编辑/预览 => openDrawer，但是只有编辑和预览有id
      if (type !== 'add') {
        const res = await getArticleDetail(id)
        this.form = {
          ...res.data
        }
      }
    },
    handleClose (done) {
      // $confirm 可以弹出一个确认框，可确认.then  可取消.catch
      this.$confirm('你确认要关闭么？').then(() => {
        // done() // done() 调用，就代表关闭抽屉
        console.log('点击了确认')
        this.closeDrawer()
      }).catch((e) => {
        console.log('取消', e)
      })
    },

    async submit () {
      // 校验 (对整个表单校验)
      await this.$refs.form.validate()

      if (this.drawerType === 'add') {
        // 请求
        await createArticle(this.form)
        // 提示
        this.$message.success('恭喜添加成功')
      }
      if (this.drawerType === 'edit') {
        // 请求
        const { id, stem, content } = this.form
        await updateArticle({ id, stem, content })
        // 提示
        this.$message.success('恭喜修改成功')
      }

      // 关闭抽屉
      this.closeDrawer()
      // 重新渲染 将当前页重置到第一页
      // (新增/修改的数据，新增修改都会到第一页去了)
      this.current = 1
      this.initData()
    },

    closeDrawer () {
      // 将form也手动重置
      this.form = {
        stem: '', // 标题
        content: '' // 内容
      }
      // 只有非预览的情况(添加/修改) 需要重置
      if (this.drawerType !== 'preview') {
        this.$refs.form.resetFields() // 重置表单
      }
      this.isShowDrawer = false // 关闭抽屉
    },

    // 发送初始化请求的方法
    async initData () {
      const { data } = await getArticleList({
        current: this.current,
        pageSize: this.pageSize
      })
      this.total = data.total
      this.tableData = data.rows
    },
    async del (id) {
      // 删除请求
      await removeArticle(id)
      // 添加成功的提示
      this.$message.success('删除成功')

      // 处理删除当前页的最后一条
      if (this.tableData.length === 1 && this.current > 1) {
        this.current--
      }
      // 重新渲染
      this.initData()
    },
    // 处理当前页的变化
    handleCurrentChange (val) {
      // console.log('当前页变化了', val)
      // 更新数据中的当前页
      this.current = val
      // 重新请求
      this.initData()
    }

  }
}

</script>

<style lang="scss" scoped>
.el-card {
  margin-top: 25px;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 16px;
  }
  .actions {
    font-size: 18px;
    display: flex;
    justify-content: space-around;
    color: #666;
    > i:hover {
      color: rgba(114, 124, 245, 1);
      cursor: pointer;
    }
  }
}
.el-pagination {
  margin-top: 20px;
  text-align: center;
}
.el-breadcrumb {
  margin-top: 10px;
}
.el-form {
  padding-right: 40px;
}
.quill-editor {
  ::v-deep .ql-editor {
    height: 300px;
  }
}
.el-rate {
  padding: 10px 0;
}
.article-preview {
  padding: 0 40px 40px 40px;
  > h5 {
    font-size: 20px;
    color: #666;
    border-bottom: 1px dashed #ccc;
    padding-bottom: 30px;
    margin: 0 0 20px 0;
  }
}
</style>

import request from '@/utils/request'

// 1. 获取文章面经列表
export const getArticleList = ({ current, pageSize }) => {
  return request.get('/admin/interview/query', {
    params: {
      current,
      pageSize
    }
  })
}

// 2. 新增文章
export const createArticle = ({ stem, content }) => {
  return request.post('/admin/interview/create', {
    stem,
    content
  })
}

// 3. 删除文章
export const removeArticle = (id) => {
  return request.delete('/admin/interview/remove', {
    // params: {}, // 地址栏的查询参数传参
    data: { id } // 请求体传参body传参
  })
}

// 4. 根据id获取当前文章的详情 → 回显
export const getArticleDetail = id => {
  return request.get('/admin/interview/show', {
    params: { id } // 地址栏查询参数传参
  })
}

// 5. 根据id提交修改文章
export const updateArticle = ({ id, stem, content }) => {
  return request.put('/admin/interview/update', { id, stem, content })
}

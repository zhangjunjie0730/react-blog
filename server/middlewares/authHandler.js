const { checkToken } = require('../utils/token');

/**
 * role === 1 管理员权限路由
 */
const verifyList1 = [
  { regexp: /\/article\/output/, required: 'get', verifyTokenBy: 'url' }, // 导出文章 verifyTokenBy 从哪里验证 token
  { regexp: /\/article/, required: 'post, put, delete' }, // 普通用户 禁止修改或者删除、添加文章
  { regexp: /\/discuss/, required: 'delete, post' }, // 普通用户 禁止删除评论
  { regexp: /\/user/, required: 'get, put, delete' }, // 普通用户 禁止获取用户、修改用户、以及删除用户
];

/**
 * role === 2 普通用户权限路由
 */
const verifyList2 = [
  { regexp: /\/discuss/, required: 'post' }, // 未登录用户 禁止评论
];

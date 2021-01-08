const Router = require('koa-router');
const router = new Router();

// 获取tag和categories列表
router.get('/tag/list', async ctx => {
  ctx.body = '/tag/list';
});
router.get('/category/list', async ctx => {
  ctx.body = '/category/list';
});

// 用户login和register
router.post('/login', async ctx => {
  ctx.body = '登陆成功';
});
router.post('/register', async ctx => {
  ctx.body = '注册成功';
});

module.exports = router;

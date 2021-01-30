const Router = require('koa-router');
const router = new Router();
const { login } = require('../controllers/user');

const { getTagList, getCategoryList } = require('../controllers/tag');

// 获取tag和categories列表
router.get('/tag/list', getTagList);
router.get('/category/list', getCategoryList);

// 用户login和register
router.post('/login', login);
router.post('/register', async ctx => {
  ctx.body = '注册成功';
});

module.exports = router;

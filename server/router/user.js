const Router = require('koa-router');
const router = new Router({ prefix: '/user' });

router.get('/list', async ctx => {
  ctx.body = 'get article/list';
});

router.put('/:userId', async ctx => {
  const { userId } = ctx.params;
  ctx.body = `userId:${userId}`;
});

router.delete('/:userId', async ctx => {
  ctx.body = `delete success`;
});

module.exports = router;

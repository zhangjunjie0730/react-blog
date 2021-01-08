const Router = require('koa-router');
const router = new Router({ prefix: '/article' });

router
  .get('/list', async ctx => {
    ctx.body = '文章列表如下';
  })
  .get('/output/all', async ctx => {
    ctx.body = '导出所有文章';
  })
  .get('/output/:id', async ctx => {
    ctx.body = '导出指定文章';
  })
  .get('/:id', async ctx => {
    ctx.body = '获取指定文章';
  });

router
  .post('/', async ctx => {
    ctx.body = '添加文章成功';
  })
  .post('/upload', async ctx => {
    ctx.body = '上传文章';
  })
  .post('/checkExist', async ctx => {
    ctx.body = '检查是否存在该文章';
  })
  .post('/upload/confirm', async ctx => {
    ctx.body = '确实上传';
  });

router.put('/:id', async ctx => {
  ctx.body = '修改置顶文章';
});

router
  .delete('/:id', async ctx => {
    ctx.body = '删除指定文章';
  })
  .delete('/list/:list', async ctx => {
    ctx.body = '删除指定文章列表';
  });

module.exports = router;

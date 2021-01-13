const Router = require('koa-router');
const router = new Router({ prefix: '/article' });
const {
  getArticleById,
  delete: del,
  create,
  getArticleList,
  update,
  delList,
} = require('../controllers/article');

router
  .get('/list', getArticleList)
  .get('/output/all', async ctx => {
    ctx.body = '导出所有文章';
  })
  .get('/output/:id', async ctx => {
    ctx.body = '导出指定文章';
  })
  .get('/:id', getArticleById);

router
  .post('/', create)
  .post('/upload', async ctx => {
    ctx.body = '上传文章';
  })
  .post('/checkExist', async ctx => {
    ctx.body = '检查是否存在该文章';
  })
  .post('/upload/confirm', async ctx => {
    ctx.body = '确实上传';
  });

router.put('/:id', update);

router.delete('/:id', del).delete('/list/:list', delList);

module.exports = router;

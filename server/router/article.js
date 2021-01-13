const Router = require('koa-router');
const router = new Router({ prefix: '/article' });
const {
  getArticleById,
  delete: del,
  create,
  getArticleList,
  update,
  delList,
  checkExist,
  upload,
  uploadConfirm,
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
  .post('/upload', upload)
  .post('/checkExist', checkExist)
  .post('/upload/confirm', uploadConfirm);

router.put('/:id', update);

router.delete('/:id', del).delete('/list/:list', delList);

module.exports = router;

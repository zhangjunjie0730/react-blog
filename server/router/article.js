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
  output,
  outputList,
  outputAll,
} = require('../controllers/article');

router
  .get('/list', getArticleList)
  .get('/output/all', outputAll)
  .get('/output/:id', output)
  .get('/output/list/:list', outputList)
  .get('/:id', getArticleById);

router
  .post('/', create)
  .post('/upload', upload)
  .post('/checkExist', checkExist)
  .post('/upload/confirm', uploadConfirm);

router.put('/:id', update);

router.delete('/:id', del).delete('/list/:list', delList);

module.exports = router;

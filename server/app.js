const Koa = require('koa');
const cors = require('koa2-cors');

const route = require('./router');
const { PORT } = require('./config');
const db = require('./database');
const koaBody = require('koa-body');

const app = new Koa();

// 为app的参数context绑定自定义的属性
const context = require('./utils/context');
Object.keys(context).forEach(key => {
  app.context[key] = context[key];
});

app.use(cors()).use(
  koaBody({
    multipart: true, // 支持文件上传
    formidable: {
      // uploadDir: path.resolve(__dirname, './upload'),
      keepExtensions: true, // 保持文件的后缀
      maxFileSize: 2000 * 1024 * 1024, // 设置上传文件大小最大限制，默认20M
    },
  })
);

route(app);

app.listen(PORT, () => {
  db.sequelize.sync({ force: false }).then(() => {
    console.log(`sequelize connect success`);
    console.log('当前环境：', process.env.NODE_ENV);
    console.log(`sevice listen on http://127.0.0.1:${PORT}`);
  });
});

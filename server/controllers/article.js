const Joi = require('joi');
const fs = require('fs');
const path = require('path');
const { send } = require('koa-send');
const Sequelize = require('sequelize');
const { or, not, like } = Sequelize.Op;
const {
  article: ArticleModel,
  tag: TagModel,
  category: CategoryModel,
  comment: CommentModel,
  reply: ReplyModel,
  user: UserModel,
  sequelize,
} = require('../database');

// article <=> md.File 方法
const {
  findOrCreateFileSavePath,
  uploadPath,
  outputPath,
  getContentFromMdFile,
  getMdFileFromArticle,
} = require('../utils/file');

class ArticleController {
  // 初始化about页面
  static async initAboutPage() {
    const res = await ArticleModel.findOne({ where: { id: -1 } });
    if (!res)
      ArticleModel.create({
        id: -1,
        title: 'About Page',
        content: "It's the content of About Page, please do not delete it!",
      });
  }

  static async create(ctx) {
    const validator = ctx.validate(ctx.request.body, {
      // authorId: Joi.number().required(),
      title: Joi.string().required(),
      content: Joi.string(),
      categoryList: Joi.array(),
      tagList: Joi.array(),
    });
    if (validator) {
      const { title, content, categoryList = [], tagList = [], authorId } = ctx.request.body;
      const res = await ArticleModel.findOne({ where: { title } });
      if (res) {
        ctx.body = '添加失败，该文章已存在！';
      } else {
        const tags = tagList.map(t => ({ name: t }));
        const categories = categoryList.map(c => ({ name: c }));
        const data = await ArticleModel.create(
          { title, content, authorId, tags, categories },
          { include: [TagModel, CategoryModel] }
        );
        console.log(data);
        ctx.body = data;
      }
    }
  }

  // 删除文章delete
  static async delete(ctx) {
    const validator = ctx.validate(ctx.params, {
      id: Joi.number().required(),
    });
    if (validator) {
      const articleId = ctx.params.id;
      await sequelize.query(
        `delete comment, reply, category, tag, article
      from article 
      left join reply on article.id=reply.articleId 
      left join comment on article.id=comment.articleId 
      left join category on article.id=category.articleId 
      left join tag on article.id=tag.articleId 
      where article.id=${articleId}`
      );
      // ctx.status = 204;
      ctx.body = `删除文章成功!`;
    }
  }

  // 获取文章详情
  static async getArticleById(ctx) {
    const validator = ctx.validate(
      {
        ...ctx.params,
        ...ctx.query,
      },
      {
        id: Joi.number().required(),
        // 是否增加viewCount，1则增加
        isView: Joi.number(),
      }
    );
    if (validator) {
      const res = await ArticleModel.findOne({
        where: { id: ctx.params.id },
        include: [
          // 查找 分类 标签 评论 回复...
          { model: TagModel, attributes: ['name'] },
          { model: CategoryModel, attributes: ['name'] },
          {
            model: CommentModel,
            attributes: ['id', 'content', 'createdAt'],
            include: [
              {
                model: ReplyModel,
                attributes: ['id', 'content', 'createdAt'],
                include: [
                  {
                    model: UserModel,
                    as: 'user',
                    attributes: { exclude: ['updatedAt', 'password'] },
                  },
                ],
              },
              { model: UserModel, as: 'user', attributes: { exclude: ['updatedAt', 'password'] } },
            ],
            row: true,
          },
        ],
        order: [
          [CommentModel, 'createdAt', 'DESC'],
          [[CommentModel, ReplyModel, 'createdAt', 'ASC']],
        ], // comment model order
        row: true,
      });
      if (!res) {
        ctx.body = '文章不存在！';
      } else {
        const { type = 1 } = ctx.query;
        type === 1 &&
          ArticleModel.update({ viewCount: ++res.viewCount }, { where: { id: ctx.params.id } });
        res.comments.forEach(comment => {
          comment.user.github = JSON.parse(comment.user.github);
          comment.replies.forEach(reply => (reply.user.github = JSON.parse(reply.user.github)));
        });
        ctx.body = res;
      }
    }
  }

  // 获得文章列表
  static async getArticleList(ctx) {
    const validator = ctx.validate(ctx.query, {
      page: Joi.string(),
      pageSize: Joi.number(),
      keyword: Joi.string().allow(''),
      category: Joi.string(),
      tag: Joi.string(),
      preview: Joi.number(),
      order: Joi.string(),
    });
    if (validator) {
      const {
        page = 1,
        pageSize = 10,
        preview = 1,
        keyword = '',
        tag,
        category,
        order,
      } = ctx.query;
      const tagFilter = tag ? { name: tag } : null;
      const categoryFilter = category ? { name: category } : null;

      let articleOrder = [['createdAt', 'DESC']];
      if (order) articleOrder = [order.split(' ')];

      const data = await ArticleModel.findAndCountAll({
        where: {
          id: { [not]: -1 },
          [or]: { title: { [like]: `%${keyword}%` }, content: { [like]: `%${keyword}%` } },
        },
        include: [
          { model: TagModel, attributes: ['name'], where: tagFilter },
          { model: CategoryModel, attributes: ['name'], where: categoryFilter },
          {
            model: CommentModel,
            attributes: ['id'],
            include: [{ model: ReplyModel, attributes: ['id'] }],
          },
        ],
        offset: (page - 1) * pageSize,
        limit: parseInt(pageSize),
        order: articleOrder,
        row: true,
        distinct: true,
      });
      if (preview === 1) data.rows.forEach(d => (d.content = d.content.slice(0, 1000)));
      ctx.body = data;
    }
  }

  // 更新文章
  static async update(ctx) {
    const validator = ctx.validate(
      {
        articleId: ctx.params.id,
        ...ctx.request.body,
      },
      {
        articleId: Joi.number().required(),
        title: Joi.string(),
        content: Joi.string(),
        categories: Joi.array(),
        tags: Joi.array(),
      }
    );
    if (validator) {
      const { title, content, categories = [], tags = [] } = ctx.request.body;
      const articleId = parseInt(ctx.params.id);
      const tagList = tags.map(tag => ({ name: tag, articleId }));
      const categoryList = categories.map(cate => ({ name: cate, articleId }));
      await ArticleModel.update({ title, content }, { where: { id: articleId } });
      await TagModel.destroy({ where: { articleId } });
      await TagModel.bulkCreate(tagList);
      await CategoryModel.destroy({ where: { articleId } });
      await CategoryModel.bulkCreate(categoryList);
      ctx.body = '文章更新成功！';
    }
  }

  // 删除多个文章
  static async delList(ctx) {
    const validator = ctx.validate(ctx.params, {
      list: Joi.string().required(),
    });

    if (validator) {
      const list = ctx.params.list.split(',');
      await sequelize.query(
        `delete comment, reply, category, tag, article
        from article 
        left join reply on article.id=reply.articleId 
        left join comment on article.id=comment.articleId 
        left join category on article.id=category.articleId 
        left join tag on article.id=tag.articleId 
        where article.id in (${list})`
      );
      ctx.status = '删除文章列表成功';
    }
  }

  /**
   * 查看文件名是否在文章数据库中存在
   * 存在：返回数据库中这个文章的信息
   * 不存在：解析md文件，存入数据库
   */
  static async checkExist(ctx) {
    const validator = ctx.validate(ctx.request.body, {
      fileNameList: Joi.array().required(),
    });
    if (validator) {
      const { fileNameList } = ctx.request.body;
      const list = await Promise.all(
        fileNameList.map(async fileName => {
          const filePath = `${uploadPath}/${fileName}`;
          const file = getMdFileFromArticle(filePath);
          const title = file.title || fileName.replace(/\.md/, '');
          const article = await ArticleModel.findOne({ where: { title }, attributes: ['id'] });
          const result = { fileName, title };
          if (article) {
            result.exist = true;
            result.articleId = article.id;
          }
        })
      );
      ctx.body = list;
    }
  }

  // upload 上传文章
  static async upload(ctx) {
    const file = ctx.request.files.file;
    await findOrCreateFileSavePath(uploadPath);

    const upload = file => {
      const reader = fs.createReadStream(file.path); // 创建可读流
      const fileName = file.name;
      const filePath = path.join(uploadPath, fileName);
      const upStream = fs.createWriteStream(filePath);
      reader.pipe(upStream);
      reader.on('end', () => console.log('上传成功！'));
    };
    Array.isArray(file) ? file.forEach(item => upload(item)) : upload(file);
    ctx.body = '上传成功';
  }

  // uploadConfirm 确认上传：读取文章并插入到数据库
  static async uploadConfirm(ctx) {
    const validator = ctx.validate(ctx.request.body, {
      authorId: Joi.number(),
      uploadList: Joi.array(),
    });
    if (validator) {
      const { uploadList, authorId } = ctx.request.body;
      await findOrCreateFileSavePath(uploadPath);

      const _parseList = list => {
        return list.map(item => {
          const filePath = path.join(uploadPath, item.fileName);
          const result = getContentFromMdFile(filePath);
          const { title, date, categories = [], tags = [], content } = result;
          const data = {
            title: title || item.fileName.replace(/\.md/, ''),
            categories: categories.map(c => ({ name: c })),
            tags: tags.map(t => ({ name: t })),
            content,
            authorId,
          };
          if (date) data.createAt = date;
          if (item.articleId) data.articleId = item.articleId;
          return data;
        });
      };

      const list = _parseList(uploadList);
      const updateList = list.filter(d => !!d.articleId);
      const insertList = list.filter(d => !d.articleId);

      // 将文章插入数据库
      const insertResultList = await Promise.all(
        insertList.map(data => ArticleModel.create(data, { include: [TagModel, CategoryModel] }))
      );

      const updateResultList = await Promise.all(
        updateList.map(async data => {
          const { title, content, categories = [], tags = [], articleId } = data;
          await ArticleModel.update({ title, content }, { where: { id: articleId } });
          await TagModel.destroy({ where: { articleId } });
          await TagModel.bulkCreate(tags);
          await CategoryModel.destroy({ where: { articleId } });
          await CategoryModel.bulkCreate(categories);
          return ArticleModel.findOne({ where: { id: articleId } });
        })
      );

      ctx.body = { message: 'success', insertList: insertResultList, updateList: updateResultList };
    }
  }

  // 导出文章
  static async output(ctx) {
    const validator = ctx.validate(ctx.params, {
      id: Joi.number().required(),
    });
    if (validator) {
      const article = await ArticleModel.findOne({
        where: { id: ctx.params.id },
        include: [
          // 查找 分类和标签
          { model: TagModel, attributes: ['name'] },
          { model: CategoryModel, attributes: ['name'] },
        ],
      });

      const { fileName } = await getMdFileFromArticle(article);
      ctx.attachment(decodeURI(fileName));
      await send(ctx, fileName, { root: outputPath });
    }
  }
}

module.exports = ArticleController;

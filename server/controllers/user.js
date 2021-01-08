const Joi = require('joi');
const axios = require('axios');

const { GITHUB } = require('../config');
const { decodeQuery } = require('../utils');
const { createToken } = require('../utils/token');
const { comparePassword, encrypt } = require('../utils/bcrypt');
const { user: userModel, ip: ipModel, sequelize } = require('../database');
const { Op } = require('sequelize/types');

// 获取用户信息列表
exports.getList = async function (ctx) {
  const validator = ctx.validate(ctx.query, {
    username: Joi.string().allow(''),
    type: Joi.number(), // type=1: github用户；type=2: 站内用户
    'rangeDate[]': Joi.array(),
    page: Joi.string(),
    pageSize: Joi.number(),
  });
  if (validator) {
    const { page = 1, pageSize = 10, username, type } = ctx.query;
    const rangeDate = ctx.query['rangeDate[]'];
    const where = { role: { [Op.not]: 1 } };
    if (username) {
      where.username = {};
      where.username[[Op.like]] = `%${username}%`;
    }
    if (type) where.github = parseInt(type) === 1 ? { [Op.not]: null } : null;
    if (Array.isArray(rangeDate) && rangeDate.length === 2)
      where.createdAt = { [Op.between]: rangeDate };

    const result = await userModel.findAndCountAll({
      where,
      offset: (page - 1) * pageSize,
      limit: parseInt(pageSize),
      row: true,
      order: ['createdAt', 'DESC'],
    });
    ctx.body = result;
  }
};

// 更新用户信息
exports.updateUser = async function (ctx) {
  const validator = ctx.validate(
    {
      ...ctx.params,
      ...ctx.request.body,
    },
    {
      userId: Joi.number().required(),
      notice: Joi.boolean(),
      disabledDiscuss: Joi.boolean(),
    }
  );

  if (validator) {
    const { userId } = ctx.params;
    const { notice, disabledDiscuss } = ctx.request.body;
    await updateUserById(userId, { notice, disabledDiscuss });
    if (typeof disabledDiscuss !== 'undefined') {
      await ipModel.update({ auth: !disabledDiscuss }, { where: { userId: parseInt(userId) } });
    }
    ctx.status = 204;
  }
};

// 删除用户
exports.deleteUser = async function (ctx) {
  const validator = ctx.validate(ctx.params, {
    userId: Joi.number().required(),
  });
  if (validator) {
    await sequelize.query(
      `delete comment, reply from comment left join reply on comment.id=reply.commentId where comment.userId=${ctx.params.userId}`
    );
    await userModel.destroy({ where: { id: ctx.params.userId } });
    ctx.status = 204;
  }
};

/* ---------utils--------- */

/* ---------utils database operation--------- */
// 1.查
function find(params) {
  return userModel.findOne({ where: params });
}
// 2.创建用户
function createGithubUser(data, role = 2) {
  const { id, login, email } = data;
  return userModel.create({
    id,
    username: login,
    role,
    email,
    github: JSON.stringify(data),
  });
}
// 3.更新用户
function updateUserById(userId, data) {
  return userModel.update(data, { where: { id: userId } });
}

/* ---------utils github operation--------- */
// 1.获取用户信息
async function getGithubInfo(username) {
  const result = await axios.get(`${GITHUB.fetch_user}${username}`);
  return result && result.data;
}
// 2.github登录
async function githubLogin(ctx, code) {
  const result = await axios.post(GITHUB.access_token_url, {
    client_id: GITHUB.client_id,
    clien_secret: GITHUB.client_secret,
    code,
  });
  const { access_token } = decodeQuery(result.data);
  if (access_token) {
    // 拿到 access_token获取用户信息
    const res = await axios.get(`${GITHUB.fetch_user_url}?access_token=${access_token}`);
    const githubInfo = res.data;

    let target = await find({ id: githubInfo.id });
    if (!target) {
      // 新用户
      target = await userModel.create({
        id: githubInfo.id,
        username: githubInfo.name || githubInfo.username,
        github: JSON.stringify(githubInfo),
        email: githubInfo.email,
      });
    } else {
      if (target.github !== JSON.stringify(githubInfo)) {
        // 信息有变化, 更新user
        const { id, login, email } = githubInfo;
        const data = {
          username: login,
          email,
          github: JSON.stringify(githubInfo),
        };
        await updateUserById(id, data);
      }
    }
    const token = createToken({ userId: githubInfo.id, role: target.role });
    ctx.body = {
      github: githubInfo,
      username: target.username,
      userId: target.id,
      role: target.role,
      token,
    };
  } else {
    ctx.throw(403, 'github 授权码失效！');
  }
}

/* ---------utils login&register--------- */
// 1.站内用户注册
async function register(ctx) {
  const validator = ctx.validate(ctx.request.body, {
    username: Joi.string().required(),
    password: Joi.string().required(),
    email: Joi.string().email().required(),
  });
  if (validator) {
    const { username, password, email } = ctx.request.body;
    const result = await userModel.findOne({ where: { email } });
    if (result) {
      ctx.throw(403, '邮箱已被注册');
    } else {
      const user = await userModel.findOne({ where: { username } });
      if (user && !user.github) {
        ctx.throw(403, '用户名已被占用');
      } else {
        const saltPassword = await encrypt(password);
        await userModel.create({ username, password: saltPassword, email });
        ctx.status = 204;
      }
    }
  }
}
// 2.站内登录
async function defaultLogin(ctx) {
  const validator = ctx.validate(ctx.request.body, {
    account: Joi.string().required(),
    password: Joi.string(),
  });
  if (validator) {
    const { account, password } = ctx.request.body;
    const user = await userModel.findOne({
      where: {
        username: account,
      },
    });
    if (!user) {
      ctx.throw(403, '用户不存在');
    } else {
      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        ctx.throw(403, '密码不正确');
      } else {
        const { id, role } = user;
        const token = createToken({ username: user.username, userId: id, role });
        ctx.body = { username: user.name, role, userId: id, token };
      }
    }
  }
}
// 2.login
async function login(ctx) {
  const { code } = ctx.request.body;
  if (code) {
    await githubLogin(ctx, code);
  } else {
    await defaultLogin(ctx);
  }
}

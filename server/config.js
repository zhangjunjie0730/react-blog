// 开发环境模式
const devMode = process.env.NODE_ENV === 'development';

const config = {
  PORT: 3002,
  GITHUB_INFO: {
    client_id: 'e9c72a498f6ba0ae8528',
    client_secret: 'd9ec327e859f84971d45ee5fe00b398401ecf8ad',
    access_token_url: 'https://github.com/login/oauth/access_token',
    fetch_user_url: 'https://api.github.com/user', // 用于 oauth2
  },
  TOKEN: {
    secret: 'zhangjunjie-blog',
    expiresIn: '720h',
  },
  DATABASE: {
    database: 'react_blog',
    user: 'root',
    password: 'root',
    options: {
      host: 'localhost', // 连接的 host 地址
      port: 3306,
      dialect: 'mysql', // 连接到 mysql
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
      define: {
        timestamps: false, // 默认不加时间戳
        freezeTableName: true, // 表名默认不加 s
      },
      timezone: '+08:00',
    },
  },
};

// 如果是生产环境，隐去所有敏感信息
if (!devMode) {
  console.log('env production....');

  // ==== 配置数据库
  config.DATABASE = {
    ...config.DATABASE,
    database: '', // 数据库名
    user: '', // 账号
    password: '', // 密码
  };

  // 配置 github 授权
  config.GITHUB.client_id = '';
  config.GITHUB.client_secret = '';

  // ==== 配置 token 密钥
  config.TOKEN.secret = '';
}

module.exports = config;

const { DATABASE } = require('../config');
const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');

const { database, user, password, options } = DATABASE;

const sequelize = new Sequelize(database, user, password, {
  ...options,
});

const db = {};

const modelsPath = path.resolve(__dirname, 'models');
// 读取该路径下所有的文件名，返回一个数组：['user.js','tag.js',...]
fs.readdirSync(modelsPath).forEach(file => {
  // const model = sequelize.import(path.join(modelsPath, file));
  const model = require(path.join(modelsPath, file))(sequelize, Sequelize);

  db[model.name] = model;

  // const daily = require('../schema/daily')(sequelize, DataTypes);
});

Object.keys(db).forEach(modelName => {
  // 如果有关联表，进行关联
  if (db[modelName].associate) db[modelName].associate(db);
});

db.sequelize = sequelize;

module.exports = db;

const fs = require('fs');

module.exports = server => {
  fs.readdirSync(__dirname).forEach(file => {
    if (file === 'index.js') return;
    const router = require(`./${file}`);
    server.use(router.routes());
  });
};

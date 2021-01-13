const fs = require('fs');

module.exports = server => {
  fs.readdirSync(__dirname).forEach(file => {
    if (file === 'index.js') return;
    const route = require(`./${file}`);
    server.use(route.routes());
  });
};

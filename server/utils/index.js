/**
 * 解码 url 请求
 * @param {String} url
 * @returns {Object}
 */
exports.decodeQuery = function (url) {
  const params = {};
  const paramsStr = url.split('?')[1];
  paramsStr.split('&').forEach(v => {
    const d = v.split('=');
    if (d[1] && d[0]) params[d[0]] = d[1];
  });
};

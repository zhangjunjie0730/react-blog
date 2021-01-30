import marked from 'marked';
import xss from 'xss';
import { COLOR_LIST } from './config';
import { getLocalStorage } from './localStorage';

// 获取 url query 参数
export const decodeQuery = url => {
  const params = {};
  const paramsStr = url.replace(/\.*\?/, ''); // a=1&b=2&c=&d=xxx&e
  paramsStr.split('&').forEach(v => {
    const d = v.split('=');
    if (d[1] && d[0]) params[d[0]] = d[1];
  });
  return params;
};

/**
 * 查看外部的url地址是否以这几个开头
 * @param {string} path
 * @returns {Boolean}
 */
export const isExternal = path => {
  return /^(https?:|http:|mailto:|tel:|)/.test(path);
};

/**
 * getUrlQuery
 * @param {string} path
 * @returns {string} params
 */
export const getUrlQuery = url => {
  const params = {};
  const paramsStr = url.replace(/\.*\?/, '');
  paramsStr.split('&').forEach(item => {
    const param = item.split('=');
    if (param[1] && param[0]) params[param[0]] = param[1];
  });
  return params;
};

// 转化 md 语法为 html
export const translateMarkdown = (plainText, isGuardXss = false) => {
  return marked(isGuardXss ? xss(plainText) : plainText, {
    renderer: new marked.Renderer(),
    gfm: true,
    pedantic: false,
    sanitize: false,
    tables: true,
    breaks: true,
    smartLists: true,
    smartypants: true,
    // highlight: function (code) {
    //   /* eslint no-undef: "off" */
    //   return hljs.highlightAuto(code).value;
    // },
  });
};

/**
 * getToken
 * @returns {string} token
 */
export const getToken = () => {
  let token = '';
  const userInfo = getLocalStorage('userInfo');
  if (userInfo && userInfo.token) {
    token = 'zjj' + userInfo.token;
  }
  return token;
};

/**
 * getRandomId
 * @params {string} length
 * @returns {string} id
 */
export const getRandomId = length => {
  return Math.random().toString(36).substr(3, length);
};

/**
 * myDebounce
 */
export const myDebounce = (func, wait) => {
  let timer = null;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      func.apply(context, args);
    }, wait);
  };
};

/**
 * 取数组索引的随机数
 * @param {Array} arr
 * @param {Number} index
 */
export const getRandomIndex = arr => Math.floor(Math.random() * arr.length);

/**
 * getRandomColor 用于标签的color
 */
export const getRandomColor = (list = [], colorList = COLOR_LIST) => {
  const _list = [...list];
  _list.forEach((item, index) => {
    item.color = colorList[index] || colorList[getRandomIndex(colorList)];
  });
  return _list;
};

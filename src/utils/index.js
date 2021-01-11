import { COLOR_LIST } from './config';
import { getLocalStorage } from './localStorage';

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

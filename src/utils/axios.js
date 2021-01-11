import { message } from 'antd';
import axios from 'axios';
import { API_BASE_URL } from 'config';
import { getToken } from 'utils';

const service = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
});

let timer;

// 拦截请求
service.interceptors.request.use(
  config => {
    const token = getToken();
    if (token) {
      config.headers.common['Authorization'] = token;
    }
    return config;
  },
  error => {
    message.error('bed request');
    Promise.reject(error);
  }
);

// 拦截响应
service.interceptors.response.use(
  response => response.data,
  error => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (error.response) {
        const { status, data } = error.response;
        switch (status) {
          case 401:
            message.error((data && data.message) || `连接错误 ${status}!`);
            break;
          default:
            message.error(data.message || `连接错误 ${status}!`);
            break;
        }
      } else {
        message.error(error.message || `连接错误`);
      }
    }, 200); // 200ms内重复报错只提醒一次
    return Promise.reject(error);
  }
);

export default service;

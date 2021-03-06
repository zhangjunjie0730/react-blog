import { message } from 'antd';
import myAxios from 'utils/axios';

export const USER_LOGIN = 'USER_LOGIN';
export const USER_REGISTER = 'USER_REGISTER';
export const USER_LOGIN_OUT = 'USER_LOGIN_OUT';

export const register = params => {
  return dispatch =>
    myAxios.post('/register', params).then(res => {
      message.success('注册成功，请您重新登录您的账号！');
    });
};

export const login = params => {
  return dispatch =>
    myAxios.post('/login', params).then(res => {
      dispatch({
        type: USER_LOGIN,
        payload: res,
      });
      message.success(`登陆成功，欢迎您${res.username}！`);
      return res;
    });
};

export const loginout = () => ({
  type: USER_LOGIN_OUT,
});

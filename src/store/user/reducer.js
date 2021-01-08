import { USER_LOGIN, USER_LOGIN_OUT } from './actions';
import { save, get, remove } from 'utils/localStorage';

let defaultState = {
  username: '',
  role: 2,
  userId: 0,
  github: null,
};

if (get('userInfo')) defaultState = { ...defaultState, ...get('userInfo') };

export default function userReducer(state = defaultState, action) {
  const { type, payload } = action;
  switch (type) {
    case USER_LOGIN:
      const { username, userId, role, github = null, token } = payload;
      save('userInfo', { username, userId, role, github, token });
      return { ...state, username, userId, role, github };
    case USER_LOGIN_OUT:
      remove('userInfo');
      return { ...state, username: '', userId: 0, role: 2, github: null };
    default:
      return state;
  }
}

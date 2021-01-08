import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import articleReducer from './article/reducer';
import userReducer from './user/reducer';

const rootReducers = combineReducers({
  article: articleReducer,
  user: userReducer,
});

let storeEnhancers;
// 生产环境不添加redux插件
if (process.env.NODE_ENV === 'production') {
  storeEnhancers = applyMiddleware(thunk);
} else {
  storeEnhancers = composeWithDevTools(applyMiddleware(thunk));
}

const store = createStore(rootReducers, {}, storeEnhancers);

export default store;

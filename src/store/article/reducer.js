import { ARTICLE_GET_CATEGORY_LIST, ARTICLE_GET_TAG_LIST } from './actions';

const defaultState = {
  tagList: [],
  categoryList: [],
};

export default function articleReducer(state = defaultState, action) {
  const { type, payload } = action;
  switch (type) {
    case ARTICLE_GET_TAG_LIST:
      const tagList = payload;
      return { ...state, tagList };
    case ARTICLE_GET_CATEGORY_LIST:
      const categoryList = payload;
      return { ...state, categoryList };
    default:
      return state
  }
}

import axios from 'axios';

export const ARTICLE_GET_TAG_LIST = 'ARTICLE_GET_TAG_LIST';
export const ARTICLE_GET_CATEGORY_LIST = 'ARTICLE_GET_CATEGORY_LIST';

export const getTagList = () => dispatch =>
  axios.get('http://127.0.0.1:3002/tag/list').then(list => {
    dispatch({
      type: ARTICLE_GET_TAG_LIST,
      payload: list,
    });
  });

export const getCategoryList = () => dispatch =>
  axios.get('http://127.0.0.1:3002/category/list').then(list => {
    dispatch({
      type: ARTICLE_GET_CATEGORY_LIST,
      payload: list,
    });
  });

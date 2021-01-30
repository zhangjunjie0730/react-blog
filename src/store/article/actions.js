import myAxios from 'utils/axios';

export const ARTICLE_GET_TAG_LIST = 'ARTICLE_GET_TAG_LIST';
export const ARTICLE_GET_CATEGORY_LIST = 'ARTICLE_GET_CATEGORY_LIST';

export const getTagList = () => dispatch =>
  myAxios.get('/tag/list').then(list => {
    dispatch({
      type: ARTICLE_GET_TAG_LIST,
      payload: list,
    });
  });

export const getCategoryList = () => dispatch =>
  myAxios.get('/category/list').then(list => {
    dispatch({
      type: ARTICLE_GET_CATEGORY_LIST,
      payload: list,
    });
  });

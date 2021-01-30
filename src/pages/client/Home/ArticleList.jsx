import React from 'react';
import { useHistory } from 'react-router-dom';
import { Divider } from 'antd';

const ArticleList = props => {
  const history = useHistory();
  const { list } = props;

  function jumpToArticleDetail(id) {
    history.push(`/article/${id}`);
  }

  return (
    <ul className="app-home-list">
      {list.map(item => (
        <li key={item.id} className="app-home-list-item">
          <Divider orientation="left">
            <span className="title" onClick={() => jumpToArticleDetail(item.id)}>
              {item.title}
            </span>
            <span className="posted-tiem">{item.createdAt.slice(0, 10)}</span>
          </Divider>

          <div
            className="article-detail content"
            onClick={() => jumpToArticleDetail(item.id)}
            dangerouslySetInnerHTML={{ __html: item.content }}
          />

          <div className="list-item-others">评论区</div>
        </li>
      ))}
    </ul>
  );
};

export default ArticleList;

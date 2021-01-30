import React, { useState, useEffect } from 'react';
import './index.less';
import { useMediaQuery } from 'react-responsive';
import myAxios from 'utils/axios';
import useLoading from 'hooks/useLoading';
import { translateMarkdown } from 'utils';
import { Divider, Drawer, Spin } from 'antd';
import { ClockCircleOutlined, MenuFoldOutlined } from '@ant-design/icons';
import NavAnchor from 'components/NavAnchor';

function Article(props) {
  const [loading, setLoading] = useLoading();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [article, setArticle] = useState({
    title: '',
    content: '',
    tags: [],
    categories: [],
    comments: [],
    createdAt: '',
    viewCount: 0,
  });

  useEffect(() => {
    setLoading(myAxios.get(`/article/${props.match.params.id}`))
      .then(res => {
        res.content = translateMarkdown(res.content);
        setArticle(res);
      })
      .catch(err => {
        props.history.push('/404');
      });
  }, [props.match.params.id]);

  const { title, content, tags, categories, createdAt, viewCount } = article;
  const articleId = parseInt(props.match.params.id);
  const isFoldNav = useMediaQuery({ query: '(max-width: 1300px)' });
  return (
    <Spin tip="Loading..." spinning={loading}>
      <article className="app-article" style={{ paddingRight: isFoldNav ? 0 : 275 }}>
        <div className="post-header">
          {/* Title */}
          <h1 className="post-title">{title}</h1>
          {/* Tags etc. */}
          <div className="article-desc">
            <span className="post-time">
              <ClockCircleOutlined />
              <span> {createdAt.slice(0, 10)}</span>
            </span>
            <Divider type="vertical" />
          </div>
        </div>
        {/* Content */}
        <div className="article-detail" dangerouslySetInnerHTML={{ __html: content }} />

        {/* Nav Anchor */}
        {isFoldNav ? (
          <>
            <div className="drawer-btn" onClick={() => setDrawerVisible(true)}>
              <MenuFoldOutlined />
            </div>
            <Drawer
              title={title}
              placement="right"
              closable={false}
              onClose={() => setDrawerVisible(false)}
              visible={drawerVisible}
              getContainer={() => document.querySelector('.app-article')}
            >
              <div className="right-navigation">
                <NavAnchor content={content} />
              </div>
            </Drawer>
          </>
        ) : (
          <nav className="article-navigation">
            <NavAnchor content={content} />
          </nav>
        )}
      </article>
    </Spin>
  );
}

export default Article;

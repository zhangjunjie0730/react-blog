import React, { useEffect, useMemo } from 'react';
import './index.less';
import { Empty, Pagination, Spin } from 'antd';
import useFetchList from 'hooks/useFetchList';
import { HOME_PAGESIZE } from 'utils/config';
import { decodeQuery, translateMarkdown } from 'utils';
import ArticleList from './ArticleList';
import QuickLink from './QuickLink';

function Home(props) {
  const { loading, pagination, dataList } = useFetchList({
    requestUrl: '/article/list',
    queryParams: { pageSize: HOME_PAGESIZE },
    fetchDependence: [props.location.search],
  });
  const { keyword } = decodeQuery(props.location.search);

  const list = useMemo(() => {
    return [...dataList].map(item => {
      const index = item.content.indexOf('<!--more-->');
      item.content = translateMarkdown(item.content.slice(0, index));
      return item;
    });
  }, [dataList]);

  useEffect(() => (document.title = '张俊杰的博客'), []);

  return (
    <Spin tip="Loading..." spinning={loading}>
      <div className="app-home">
        {/* article list */}
        <ArticleList list={list} />

        {/* quick link */}
        <QuickLink list={list} />

        {/* serach empty result */}
        {list.length === 0 && keyword && (
          <div className="no-data">
            <Empty
              description={
                <span>
                  不存在标题/内容中含有 <span className="keyword">{keyword}</span> 的文章！
                </span>
              }
            />
          </div>
        )}

        <Pagination
          {...pagination}
          onChange={page => {
            document.querySelector('.app-main').scorllTop = 0;
            pagination.onChange(page);
          }}
        />
      </div>
    </Spin>
  );
}

export default Home;

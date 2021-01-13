import React, { useMemo } from 'react';
import { Spin } from 'antd';
import useFetchList from 'hooks/useFetchList';
import { HOME_PAGESIZE } from 'utils/config';

function Home(props) {
  const { loading, pagination, dataList } = useFetchList({
    requestUrl: '/article/list',
    queryParams: { pageSize: HOME_PAGESIZE },
    fetchDependence: [props.location.search],
  });

  const list = useMemo(() => {
    return [...dataList].map(item => {
      const index = item.content.indexOf('<!--more-->');
    });
  });

  return (
    <Spin tip="Loading..." spinning={loading}>
      <div className="app-home"></div>
    </Spin>
  );
}

export default Home;

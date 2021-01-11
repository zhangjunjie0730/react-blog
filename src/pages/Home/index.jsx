import React from 'react';
import { Spin } from 'antd';

function Home(props) {
  return (
    <Spin tip="Loading..." spinning={loading}>
      <div className="app-home"></div>
    </Spin>
  );
}

export default Home;

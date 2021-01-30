import React from 'react';
import { BackTop, Col, Layout, Row } from 'antd';
import 'styles/app.less';
import Header from './Header';
import SideBar from './SideBar';
import Main from './Main';

const siderLayout = { xxl: 4, xl: 5, lg: 5, sm: 0, xs: 0 };
const contentLayout = { xxl: 20, xl: 19, lg: 19, sm: 24, xs: 24 };

const AppLayout = props => {
  return (
    <Layout className="app-container">
      <Header />
      <Row className="app-wrapper">
        <Col {...siderLayout}>
          <SideBar />
        </Col>
        <Col {...contentLayout}>
          <Main {...props} />
        </Col>
      </Row>
      <BackTop target={() => document.querySelector('.app-main')} />
    </Layout>
  );
};

export default AppLayout;

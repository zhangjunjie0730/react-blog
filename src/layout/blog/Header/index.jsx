import React from 'react';
import { Col, Layout, Row } from 'antd';
import Title from './title';
import NavBar from './nav';
import SearchInput from 'components/SearchInput';

const responsiveTitle = { xxl: 4, xl: 5, lg: 5, sm: 4, xs: 24 };
const responsiveNav = { xxl: 20, xl: 19, lg: 19, sm: 20, xs: 0 };

function AppHeader() {
  return (
    <Layout.Header className="app-header">
      <Row>
        <Col {...responsiveTitle}>
          <Title />
        </Col>
        <Col {...responsiveNav}>
          <div className="header-right">
            <div id="search-box">
              <SearchInput />
            </div>
            <NavBar />
          </div>
        </Col>
      </Row>
    </Layout.Header>
  );
}
export default AppHeader;

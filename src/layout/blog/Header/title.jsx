import React from 'react';
import { Link } from 'react-router-dom';
import { BLOG_NAME } from 'config';
import { Dropdown, Menu } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import navList from './navList';
import SearchInput from 'components/SearchInput';

function Title() {
  const MobileMenu = (
    <Menu className="header-nav">
      {navList.map(nav => (
        <Menu.Item key={nav.link}>
          <Link to={nav.link}>
            {nav.icon}
            <span>{nav.title}</span>
          </Link>
        </Menu.Item>
      ))}
      <Menu.Item key={'search'}>
        <div className="search-input">
          <SearchInput />
        </div>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="header-left">
      <Link to="/">
        图标
        <span className="blog-name">{BLOG_NAME}</span>
      </Link>
      {/* 移动端折叠下拉菜单 */}
      <Dropdown
        overlayClassName="header-dropdown"
        trigger={['click']}
        overlay={MobileMenu}
        getPopupContainer={() => document.querySelector('.app-header .header-left')}
      >
        <MenuOutlined className="header-dropdown-icon" />
      </Dropdown>
    </div>
  );
}
export default Title;

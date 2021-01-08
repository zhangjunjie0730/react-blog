import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'antd';
import navList from './navList';

function NavBar(props) {
  const location = useLocation();
  const { mode = 'horizontal' } = props;
  return (
    <Menu className="header-nav" mode={mode} selectedKey={[location.pathname]}>
      {navList.map(nav => (
        <Menu.Item key={nav.link}>
          <Link to={nav.link}>
            {nav.icon}
            <span className="nav-text">{nav.title}</span>
          </Link>
        </Menu.Item>
      ))}
    </Menu>
  );
}

export default NavBar;

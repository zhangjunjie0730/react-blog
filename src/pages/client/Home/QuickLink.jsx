import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { Divider, Drawer } from 'antd';
import { MenuFoldOutlined } from '@ant-design/icons';

const title = '快速导航';

const List = props => {
  const { list, showTitle = true } = props;

  return (
    <ul className="preview">
      {showTitle && <Divider>{title}</Divider>}
      {list.map(item => (
        <li key={item.id}>
          <Link to={`/article/${item.id}`}>{item.title}</Link>
        </li>
      ))}
    </ul>
  );
};

const QuickLink = props => {
  const is1300px = useMediaQuery({ query: '(min-width: 1300px)' });
  const { list } = props;

  const [drawVisible, setDrawVisible] = useState(false);

  return is1300px ? (
    <List list={list} />
  ) : (
    <>
      <div className="drawer-btn" onClick={e => setDrawVisible(true)}>
        <MenuFoldOutlined />
      </div>
      <Drawer
        title={title}
        palacement="right"
        closable={false}
        onClose={e => setDrawVisible(false)}
        visible={drawVisible}
        getContainer={() => document.querySelector('.app-home')}
      >
        <List list={list} showTitle={false} />
      </Drawer>
    </>
  );
};

export default QuickLink;

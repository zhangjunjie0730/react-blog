import React from 'react';
import { Alert, Divider, Tag } from 'antd';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { SIDEBAR, ANNOUNCEMENT } from 'config';
import Href from 'components/Href';

function SideBar() {
  const tagList = useSelector(state => state.article.tagList || []);
  return (
    <aside className="app-sidebar">
      <img src={SIDEBAR.avatar} alt="" className="sider-avatar" />
      <h2 className="title">{SIDEBAR.title}</h2>
      <h5 className="sub-title">{SIDEBAR.subTitle}</h5>
      <ul className="home-pages">
        {Object.entries(SIDEBAR.homepages).map(([linkName, item]) => (
          <li key={linkName}>
            {item.icon}
            <Href href={item.link}>{linkName}</Href>
          </li>
        ))}
      </ul>

      {ANNOUNCEMENT.enable && <Alert message={ANNOUNCEMENT.content} type="info" />}

      <Divider orientation="center">标签</Divider>
      <div className="tag-list">
        {tagList.map((tag, index) => (
          <Tag key={tag + index} color={tag.color}>
            <Link to={`/tags/${tag.name}`}>{tag.name}</Link>
          </Tag>
        ))}
      </div>
    </aside>
  );
}
export default SideBar;

import React from 'react';
import { Button, Popover } from 'antd';
import { GithubOutlined } from '@ant-design/icons';
import './index.less';

function UserAvatar(props) {
  const { username, github, role } = props;
  if (github && props.popoverVisible) {
    return (
      <Popover
        arrowPointAtCenter
        trigger="hover"
        placement="topLeft"
        title={
          github.bio ? (
            <>
              <GithubOutlined className="mr10" />
              {github.bio}
            </>
          ) : null
        }
        content={}
      >
        <Button type="primary">Hover me</Button>
      </Popover>
    );
  }
}

export default UserAvatar;

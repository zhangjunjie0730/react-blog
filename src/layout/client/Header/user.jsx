import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useBus from 'hooks/useBus';
import { Button, Dropdown, Menu } from 'antd';
import UserAvatar from 'components/UserAvatar';
import { loginout } from 'store/user/actions';

function User(props) {
  const dispatch = useDispatch();
  const bus = useBus();
  const userInfo = useSelector(state => state.user);
  const { username, role } = userInfo;

  const MenuOverLay = (
    <Menu>
      {role === 1 && (
        <Menu.Item>
          <span onClick={() => bus.emit('openUploadModal')}>导入文章</span>
        </Menu.Item>
      )}
      {role === 1 && (
        <Menu.Item>
          <span onClick={() => props.history.push('/admin')}>后台管理</span>
        </Menu.Item>
      )}
      <Menu.Item>
        <span className="user-logout" onClick={() => dispatch(loginout())}>
          退出登录
        </span>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="header-userInfo">
      {username ? (
        <Dropdown placement="bottomCenter" overlay={MenuOverLay} trigger={['click', 'hover']}>
          <div style={{ height: 55 }}>
            <UserAvatar userInfo={userInfo} popoverVisible={false} />
          </div>
        </Dropdown>
      ) : (
        <>
          <Button
            ghost
            type="primary"
            size="small"
            style={{ marginRight: 20 }}
            onClick={() => bus.emit('openSignModal', 'login')}
          >
            登录
          </Button>
          <Button
            ghost
            type="danger"
            size="small"
            onClick={() => bus.emit('openSignModal', 'register')}
          >
            注册
          </Button>
        </>
      )}
    </div>
  );
}

export default User;

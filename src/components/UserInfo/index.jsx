import React from 'react';
import { Button, Dropdown, Menu } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { loginout } from 'store/user/actions';

function UserInfo(props) {
  const userInfo = useSelector(state => state.user);
  const dispatch = useDispatch();
  const { username, role } = userInfo;

  const MenuOverLay = (
    <Menu>
      {role === 1 && (
        <Menu.Item>
          <span>导入文章</span>
        </Menu.Item>
      )}
      {role === 1 && (
        <Menu.Item>
          <span onClick={e => props.history.push('/admin')}>后台管理</span>
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
    <>
      {username ? (
        <Dropdown placement="bottomCenter" overlay={MenuOverLay} trigger={['click', 'hover']}>
          <div style={{ height: 55 }}>
            <AppAvatar userInfo={userInfo} popoverVisible={false} />
          </div>
        </Dropdown>
      ) : (
        <>
          7
          <Button
            ghost
            type="primary"
            size="small"
            style={{ marginRight: 20 }}
            onClick={e => bus.emit('openSignModal', 'login')}
          >
            登录
          </Button>
          <Button
            ghost
            type="danger"
            size="small"
            onClick={e => bus.emit('openSignModal', 'register')}
          >
            注册
          </Button>
        </>
      )}
    </>
  );
}

export default UserInfo;

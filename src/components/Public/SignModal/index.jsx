import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Button, Form, Input, Modal } from 'antd';
import { GithubOutlined } from '@ant-design/icons';
import { useListener } from 'hooks/useBus';
import { register, login } from 'store/user/actions';
import { saveLocalStorage } from 'utils/localStorage';
import { GITHUB_AUTH } from 'config';

const FormItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

function SignModal() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [type, setType] = useState('login');

  useListener('openSignModal', type => {
    // 表单清空，重置
    form.resetFields('');
    setType(type);
    setVisible(true);
  });

  const handleSubmit = e => {
    e.preventDefault();
    form
      .validateFields()
      .then(values => {
        const action = type === 'login' ? login : register;
        dispatch(action(values)).then(() => setVisible(false));
      })
      .catch(error => console.log(error));
  };

  const githubLogin = () => {
    const { pathname, search } = location;
    saveLocalStorage('prevRouter', `${pathname}${search}`);
    window.location.href = `${GITHUB_AUTH.url}?client_id=${GITHUB_AUTH.client_id}`;
  };

  const compareToFirstPassword = (value, callback) => {
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  };

  return (
    <Modal
      width={460}
      title={type}
      visible={visible}
      onCancel={() => setVisible(false)}
      footer={null}
    >
      <Form type="horizontal">
        {/* 1.登陆状态，只有用户名和密码 */}
        {type === 'login' ? (
          <>
            <Form.Item
              {...FormItemLayout}
              label="用户名"
              name="username"
              rules={[
                {
                  required: true,
                  message: 'Please input your name',
                },
              ]}
            >
              <Input placeholder="Please input your name" />
            </Form.Item>
            <Form.Item
              {...FormItemLayout}
              label="密码"
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Please input your password',
                },
              ]}
            >
              <Input.Password placeholder="Please input your password" />
            </Form.Item>
          </>
        ) : (
          <>
            {/* 2.注册界面，用户名，密码，确认密码，邮箱 */}
            <Form.Item
              {...FormItemLayout}
              label="用户名"
              name="username"
              rules={[
                {
                  required: true,
                  message: 'Please input your name',
                },
              ]}
            >
              <Input placeholder="Please input your name" />
            </Form.Item>
            <Form.Item
              {...FormItemLayout}
              label="密码"
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Please input your password',
                },
              ]}
            >
              <Input.Password placeholder="Please input your password" />
            </Form.Item>
            <Form.Item
              {...FormItemLayout}
              label="确认密码"
              name="confirm"
              rules={[
                {
                  required: true,
                  message: 'Please input your password',
                },
                { validator: compareToFirstPassword },
              ]}
            >
              <Input.Password placeholder="Please input your password again" />
            </Form.Item>
            <Form.Item
              {...FormItemLayout}
              label="邮箱"
              name="email"
              rules={[
                {
                  required: true,
                  message: 'Please input your email',
                },
              ]}
            >
              <Input placeholder="Please input your email" />
            </Form.Item>
          </>
        )}
      </Form>
      {/* 提交按钮 */}
      <Button type="primary" block onClick={handleSubmit}>
        {type}
      </Button>
      {GITHUB_AUTH.enable && (
        <Button icon={<GithubOutlined />} block onClick={githubLogin} style={{ marginTop: 10 }}>
          Github Login
        </Button>
      )}
    </Modal>
  );
}

export default SignModal;

import { GithubOutlined } from '@ant-design/icons';

// 后台API接口地址
export const API_BASE_URL = 'http://127.0.0.1:3002';

// 博客名称
export const BLOG_NAME = 'codelife';

// 侧边栏信息
export const SIDEBAR = {
  avatar: require('assets/images/avatar.jpeg'),
  title: 'zhangjunjie',
  subTitle: '早睡早起',
  homepages: {
    github: { link: 'https://github.com/zhangjunjie0730', icon: <GithubOutlined /> },
  },
};

// 公告 announcement
export const ANNOUNCEMENT = {
  enable: true, // 是否开启
  content: (
    <>
      个人笔记网站，请访问
      <a href=""> zhang's note</a>
    </>
  ),
};

// about页面信息
export const ABOUT = {
  avatar: SIDEBAR.avatar,
  describe: SIDEBAR.subTitle,
  discuss: true,
};

// github授权信息
export const GITHUB_AUTH = {
  enable: true, // github 第三方授权开关
  client_id: 'c6a96a84105bb0be1fe5', // Setting > Developer setting > OAuth applications => client_id
  url: 'https://github.com/login/oauth/authorize', // 跳转的登录的地址
};

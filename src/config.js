// 后台API接口地址
export const API_BASE_URL = 'http://127.0.0.1:3002';

// 博客名称
export const BLOG_NAME = 'codelife';

// 侧边栏信息
export const SIDEBAR = {
  // avatar: require('https://avatars3.githubusercontent.com/u/68802498?s=400&u=1217043eb3b69df1b520fbe7dc274a71fe5d775b&v=4'),
  title: 'zhangjunjie',
  subTitle: '早睡早起',
  homepages: {
    github: 'https://github.com/zhangjunjie0730',
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

import {
  HomeOutlined,
  TagsOutlined,
  BookOutlined,
  FieldTimeOutlined,
  UserOutlined,
} from '@ant-design/icons';

const navList = [
  {
    icon: <HomeOutlined />,
    title: '首页',
    link: '/',
  },
  {
    icon: <BookOutlined />,
    title: '分类',
    link: '/categories',
  },
  {
    icon: <TagsOutlined />,
    title: '标签',
    link: '/tags',
  },
  {
    icon: <FieldTimeOutlined />,
    title: '时间轴',
    link: '/timeline',
  },
  {
    icon: <UserOutlined />,
    title: '关于我',
    link: '/aboutme',
  },
];

export default navList;

import { GITHUB } from 'config';
import Layout from 'layout/blog';

const webRoutes = {
  path: '/',
  name: 'home',
  component: Layout,
  childRoutes: [{ path: '', component: import('pages/Home') }],
};

export default webRoutes;

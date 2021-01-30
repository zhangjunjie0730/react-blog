import { GITHUB } from 'config';
import Layout from 'layout/client';
import Lazy from 'components/Lazy';

const webRoutes = {
  path: '/',
  name: 'home',
  component: Layout,
  childRoutes: [
    { path: '', component: Lazy(() => import('pages/client/Home')) },
    { path: 'article/:id', component: Lazy(() => import('pages/client/Article')) },
    { path: 'github', component: Lazy(() => import('pages/client/GithubLogin')) },
    { path: '*', component: Lazy(() => import('pages/client/404')) },
  ],
};

export default webRoutes;

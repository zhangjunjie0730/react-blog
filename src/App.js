import React from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

import routes from 'routes';
// 公共组件，挂载到 App 中：登录模态框和上传文件模态框
import Public from 'components/Public';

const App = () => {
  const role = useSelector(state => state.user.role); // 相当于 connect(state => state.user.role)(App)

  // 解构 route
  function renderRoutes(routes, contextPath) {
    const children = [];

    const renderRoute = (item, routeContextPath) => {
      let newContextPath = item.path ? `${routeContextPath}/${item.path}` : routeContextPath;
      newContextPath = newContextPath.replace(/\/+/g, '/');
      if (newContextPath.includes('admin') && role !== 1) {
        item = {
          ...item,
          component: () => <Redirect to="/" />,
          children: [],
        };
      }
      if (!item.component) return;

      if (item.childRoutes) {
        const childRoutes = renderRoutes(item.childRoutes, newContextPath);
        children.push(
          <Route
            key={newContextPath}
            render={props => <item.component {...props}>{childRoutes}</item.component>}
            path={newContextPath}
          />
        );
        item.childRoutes.forEach(r => renderRoute(r, newContextPath));
      } else {
        children.push(
          <Route key={newContextPath} component={item.component} path={newContextPath} exact />
        );
      }
    };

    routes.forEach(item => renderRoute(item, contextPath));

    return <Switch>{children}</Switch>;
  }

  const children = renderRoutes(routes, '/');
  return (
    <BrowserRouter>
      {children}
      <Public />
    </BrowserRouter>
  );
};

export default App;

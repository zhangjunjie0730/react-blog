import React, { Component } from 'react';

import { Spin } from 'antd';

/**
 * 使用 webpack 的 import 方法实现动态加载组件！dynamic import
 * @param {Function} importComponent - example const xx = asyncComponent(() => import('./xxx'))
 */
const asyncComponent = importComponent =>
  class AsyncComponent extends Component {
    constructor(props) {
      super(props);
      this.state = { component: null };
    }

    async componentDidMount() {
      const { default: component } = await importComponent();
      this.setState({ component });
    }

    render() {
      const RenderComponet = this.state.component;
      return RenderComponet ? <RenderComponet {...this.props} /> : <Spin />;
    }
  };

export default asyncComponent;

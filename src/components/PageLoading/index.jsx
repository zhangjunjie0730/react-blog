import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';

const PageLoading = props => {
  const [loading, setLoading] = useState(false);

  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);

  useEffect(() => {
    // Router.events.on('routeChangeStart', startLoading);
    // Router.events.on('routeChangeComplete', stopLoading);
    // Router.events.on('routeChangeError', stopLoading);
    return () => {
      // Router.events.off('routeChangeStart', startLoading);
      // Router.events.off('routeChangeComplete', stopLoading);
      // Router.events.off('routeChangeError', stopLoading);
    };
  });

  const loadingSpin = (
    <div className="root">
      <Spin />
      <style jsx>{`
        .root {
          position: fixed;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          background: rgba(255, 255, 255, 0.3);
          z-index: 10000;
        }
      `}</style>
    </div>
  );

  return <>{loading && loadingSpin}</>;
};
export default PageLoading;

import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { Alert } from 'antd';
import { ANNOUNCEMENT } from 'config';

function Main(props) {
  const iphoneScreen = useMediaQuery({
    query: '(max-width: 576px)',
  });
  const ipadScreen = useMediaQuery({
    query: '(min-width: 576px) and (max-width: 992px)',
  });

  return (
    <div className="app-main">
      {(iphoneScreen || ipadScreen) && ANNOUNCEMENT.enable && (
        <Alert
          message={ANNOUNCEMENT.content}
          type="info"
          style={{ marginTop: iphoneScreen ? 20 : 0, marginBottom: ipadScreen ? 20 : 0 }}
        />
      )}
      {props.children}
    </div>
  );
}

export default Main;

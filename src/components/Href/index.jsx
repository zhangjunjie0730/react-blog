import React from 'react';
import { isExternal } from 'utils';

function Href({ children, href, ...rest }) {
  let url = href;
  if (!isExternal(href)) url = `http://${href}`;

  return (
    <a href={url} target="_blank" rel="noreferrer noopener" {...rest}>
      {children}
    </a>
  );
}
export default Href;

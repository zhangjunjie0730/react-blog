import React, { useState } from 'react';

export default function useLoading() {
  const [loading, setLoading] = useState(false);

  function withLoading(request) {
    if (request instanceof Promise) {
      return new Promise((resolve, reject) => {
        setLoading(true);
        request
          .then(res => {
            resolve(res);
            setLoading(false);
          })
          .catch(err => {
            reject(err);
            setLoading(false);
          });
      });
    }
  }
  return [loading, withLoading];
}

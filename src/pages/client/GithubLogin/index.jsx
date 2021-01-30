import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from 'store/user/actions';
import { decodeQuery } from 'utils';
import { getLocalStorage } from 'utils/localStorage';

function GithubLogin(props) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState('');

  const jumpToBefore = () => {
    const url = getLocalStorage('prevRouter') || '/';
    if (url.includes('?code=')) {
      props.history.push('/');
    } else {
      props.history.push(url);
    }
  };

  useEffect(() => {
    let flag = false;
    const params = decodeQuery(props.location.search);
    if (params.code) {
      setLoading(true);
      dispatch(login({ code: params.code }))
        .then(() => {
          jumpToBefore();
          if (flag) return;
          setLoading(false);
        })
        .catch(() => {
          jumpToBefore();
          if (flag) return;
          setLoading(false);
        });
    }
    return () => (flag = true);
  }, []);

  return (
    <div className="github-loading-container">
      <div>
        <img
          src="https://github.githubassets.com/images/spinners/octocat-spinner-64.gif"
          alt="loading"
          className="github-loading-img"
        />
      </div>
      <div className="text">Loading activity...</div>
    </div>
  );
}

export default GithubLogin;

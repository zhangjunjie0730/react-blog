import myAxios from 'utils/axios';
import { useEffect, useState, useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { decodeQuery } from 'utils';
import useMount from './useMount';

/**
 * @param requestUrl queryParams请求参数 withLoading是否携带加载中flag fetchDependence用于useEffect等的依赖
 */
const useFetchList = ({
  requestUrl = '',
  queryParams = null,
  withLoading = true,
  fetchDependence = [],
}) => {
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  const location = useLocation();
  const history = useHistory();

  useMount(() => {
    if (fetchDependence.length === 0) {
      const params = decodeQuery;
      fetchWithLoading(params);
    }
  });
  useEffect(() => {
    if (fetchDependence.length > 0) {
      const params = decodeQuery(location.search);
      fetchWithLoading(params);
    }
  }, fetchDependence);

  const fetchWithLoading = params => {
    withLoading && setLoading(true);
    fetchDataList(params);
  };

  const fetchDataList = params => {
    const requestParams = {
      page: pagination.current,
      pageSize: pagination.pageSize,
      ...queryParams,
      ...params,
    };

    requestParams.page = parseInt(requestParams.page);
    requestParams.pageSize = parseInt(requestParams.pageSize);
    myAxios
      .get(requestUrl, { params: requestParams })
      .then(res => {
        pagination.total = res.count;
        pagination.current = parseInt(requestParams.page);
        pagination.pageSize = parseInt(requestParams.pageSize);
        setPagination({ ...pagination });
        setDataList(res.rows);
        withLoading && setLoading(false);
      })
      .catch(err => withLoading && setLoading(false));
  };

  const onFetch = useCallback(
    params => {
      withLoading && setLoading(true);
      fetchDataList(params);
    },
    [queryParams]
  );

  const handlePageChange = useCallback(
    page => {
      const search = location.search.includes('page=')
        ? location.search.replace(/(page=)(\d+)/, `$1${page}`)
        : `?page=${page}`;
      const jumpUrl = location.pathname + search;
      history.push(jumpUrl);
    },
    [queryParams, location.pathname]
  );

  return {
    dataList,
    loading,
    pagination: {
      ...pagination,
      onChange: handlePageChange,
    },
    onFetch,
  };
};

export default useFetchList;

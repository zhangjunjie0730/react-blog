import React from 'react';
import { useDispatch } from 'react-redux';
import useMount from 'hooks/useMount';
import { getTagList, getCategoryList } from 'store/article/actions';
import UploadModal from './UploadModal';
import SignModal from './SignModal';

function Public() {
  const dispatch = useDispatch();

  useMount(() => {
    dispatch(getTagList());
    dispatch(getCategoryList());
  });
  return (
    <>
      <SignModal />
      <UploadModal />
    </>
  );
}

export default Public;

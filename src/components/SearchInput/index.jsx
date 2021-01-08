import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Input } from 'antd';

function SearchInput() {
  const [keyword, setKeyword] = useState('');
  const history = useHistory();

  const onChange = e => {
    e.preventDefault();
    setKeyword(e.target.value);
  };
  const onPressEnter = e => e.target.blur();
  const onSubmit = () => {
    history.push(`/?page=1&keyword=${keyword}`);
    setKeyword('');
  };
  const onClick = e => e.stopPropagation();

  return (
    <Input.Search
      placeholder="search..."
      allowClear
      enterButton
      value={keyword}
      onClick={onClick}
      onChange={onChange}
      onPressEnter={onPressEnter}
      onBlur={onSubmit}
    />
  );
}

export default SearchInput;

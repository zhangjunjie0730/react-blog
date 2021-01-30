import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Modal, notification, Table, Tag, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

import useBoolean from 'hooks/useBoolean';
import { useListener } from 'hooks/useBus';
import { API_BASE_URL } from 'config';
import { getToken } from 'utils';
import myAxios from 'utils/axios';

function UploadModal() {
  // Modal显示与隐藏
  const confirmLoading = useBoolean(false);
  const [fileList, setFileList] = useState([]);
  // ajax请求/article/checkExist，检查上传后是否存在，将结果返回给这个parseList
  const [parsedList, setParsedList] = useState([]);
  // const { value: visible, setTrue, setFalse } = useBoolean(false);
  const modalVisible = useBoolean(false);

  const authorId = useSelector(state => state.user.userId);
  const timer = useRef(null);

  const columns = [
    { index: 'name', title: '文件名' },
    { index: 'title', title: '标题', render: (text, record) => getParsed(record.name).title },
    {
      index: 'exist',
      title: '动作',
      render: (text, record) => {
        if (record.status === 'error') return <Tag color="red">上传失败</Tag>;
        return getParsed(record.name).exist ? (
          <Tag color="gold">更新</Tag>
        ) : (
          <Tag color="green">插入</Tag>
        );
      },
    },
    {
      index: 'uid',
      title: '操作',
      render: (uid, record) => {
        return (
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <a
            className="delete-text"
            onClick={() => {
              const index = fileList.findIndex(file => file.uid === uid);
              fileList.splice(index, 1);
              setFileList([...fileList]);
            }}
          >
            删除
          </a>
        );
      },
    },
  ];

  useListener('openUploadModal', () => {
    setFileList([]);
    modalVisible.setTrue();
  });

  // 在文件列表中查找是否存在该文件名的文件 => 存在即为更新
  const getParsed = fileName => {
    // 返回第一个满足条件的结果
    return parsedList.find(d => d.fileName === fileName) || {};
  };

  // 文件上传后，ajax检查该文件是否存在。并且及时更新文件列表
  const handleFileChange = ({ file, fileList }) => {
    // antd 上传组件中，file自带的属性 status|uid|文件名name|下载地址url|上传进度percent|缩略图地址thumbUrl
    if (file.status === 'done') {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        const fileNameList = fileList.map(item => item.name);
        myAxios.post('/article/checkExist', { fileNameList }).then(list => {
          setParsedList(list);
        });
      }, 500);
    }
    // 更新一下文件列表
    setFileList(fileList);
  };

  const handleSubmit = () => {
    const uploadList = fileList.reduce((list, file) => {
      if (file.status === 'done') {
        const result = parsedList.find(d => file.name === d.fileName);
        list.push(result);
      }
      return list;
    }, []);
    confirmLoading.setTrue();
    myAxios
      .post('/article/upload/confirm', { authorId, uploadList })
      .then(response => {
        confirmLoading.setFalse();
        modalVisible.setFalse();
        notification.success({
          message: 'upload article success',
          description: `insert ${response.insertList.length} article and update ${response.updateList.length} article`,
        });
      })
      .catch(error => {
        console.log(error);
        notification.error({ message: 'upload article fail' });
        confirmLoading.setFalse();
      });
  };

  return (
    <Modal
      width={760}
      visible={modalVisible.value}
      title="导入文章"
      onOk={handleSubmit}
      onCancel={modalVisible.setFalse}
      // 点击遮罩层是否可以关闭模态框
      maskClosable={false}
      // 提交按钮的属性设置
      okButtonProps={{
        loading: confirmLoading.value,
        disabled: fileList.length === 0,
      }}
      // 关闭时销毁 Modal 里的子元素
      destroyOnClose
    >
      <Upload.Dragger
        name="file"
        multiple
        showUploadList={false}
        // 上传地址
        action={`${API_BASE_URL}/article/upload`}
        onChange={handleFileChange}
        headers={{ Authorization: getToken() }}
        accept="text/markdown"
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag file to this area to upload</p>
        <p className="ant-upload-hint">
          Support for a single or bulk upload. Strictly prohibit from uploading company data or
          other band files
        </p>
      </Upload.Dragger>

      {fileList.length > 0 && (
        <Table
          // showHeader={false}
          dataSource={fileList}
          columns={columns}
          rowKey="uid"
          pagination={false}
          size="small"
          style={{ marginTop: 15 }}
        />
      )}
    </Modal>
  );
}

export default UploadModal;

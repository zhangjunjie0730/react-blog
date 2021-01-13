const fs = require('fs');
const { resolve } = require('path');
const path = require('path');

const uploadPath = path.resolve(__dirname, '../upload');
const outputPath = path.resolve(__dirname, '../output');

/**
 * findOrCreateFileSavePath 创建或找到保存文件的文件夹路径
 * @param {String} filePath - 文件路径
 * @returns {Promise}
 */
function findOrCreateFileSavePath(fileSavePath) {
  return new Promise((resolve, reject) => {
    try {
      const exist = fs.existsSync(fileSavePath);
      if (exist) {
        resolve(true);
      } else {
        fs.mkdirSync(fileSavePath);
        console.log(`${fileSavePath} 路径创建成功`);
        resolve(true);
      }
    } catch (error) {
      reject(false);
    }
  });
}

/**
 * getContentFromMdFile 解析上传的md文件的内容部分
 * @param {String} filePath
 * @return {Object} - title date categories tags content
 */
function getContentFromMdFile(filePath) {
  const fileData = fs.readFileSync(filePath, 'utf-8');
  const sliceData = fileData.slice(0, 500).trim(); //
  const lastIndex = sliceData.lastIndexOf('\n---');
  const isHasPrefix = sliceData.indexOf('---') === 0 && lastIndex > 0;
  if (!isHasPrefix) {
    return { content: fileData };
  } else {
    const result = {};
    const prefixData = sliceData(4, lastIndex);
    const _decodePrefix = prefixStr => {
      /**
       * 前缀信息的格式：
       * title: test
       * date: 2020-01-14 16:15:37
       * categories:
       *  - Node
       *  - 服务器与运维
       * tags:
       *  - Node
       *  - 服务器与运维
       */
      const keyList = prefixStr.match(/.*[a-z]:/g); // 获取到 [ 'title:', 'date:', 'categories:' ] key值

      // 将字符串变成键值对 prev：keyList中上一个key，next：是下一个key => prev对于的value就在这两个之间
      const _loop = (prev, next) => {
        const start = prefixData.indexOf(prev) + prev.length;
        const end = prefixData.indexOf(next);
        const trimStr =
          end === -1 ? prefixData.slice(start).trim() : prefixData.slice(start, end).trim();
        const valueArr = trimStr.split('\n').reduce((list, item) => {
          // 处理categories和tags的value，前面带'- '
          const _item = item.trim();
          if (_item.indexOf('- ') === 0) {
            list.push(_item.replace(/- /, ''));
          } else {
            list.push(_item);
          }
          return list;
        }, []);

        const key = prev.replace(/:/, '');

        // 转化 value
        if (['title', 'date'].includes(key)) {
          if (key === 'title') {
            // 字符串以[,'"]结尾和开头的部分去除掉
            valueArr[0] = valueArr[0].replace(/^(\s|[,'"])+|(\s|[,'"])+$/g, ''); // 可能出现 title： ‘xxx’ 的情况 需要除去 ‘’
          }
          result[key] = valueArr[0];
        } else if (['tags', 'categories'].includes(key)) {
          result[key] = valueArr;
        }

        return result;
      };

      keyList.forEach((k, i) => _loop(k, keyList[i + 1])); // 解析 prefix
    };

    _decodePrefix(prefixData);
    result.content = fileData.slice(lastIndex + 4).trim();
    return result;
  }
}

/**
 * createArticleInfo 根据database信息创建信息（导出文件时放入YAML Front Matter）
 * @param {Object} {title, content, createdAt, categories, tags}
 * @result {String} 处理好的字符串
 */
function createArticleInfo({ title, content, createdAt, categories, tags }) {
  // 根据数组信息生成标签、分类字符串的方法
  const _generateTagOrCate = list => {
    const newList = list.reduce((list, item) => {
      list.push(item.name);
      return list;
    }, []);

    if (newList.length === 1) {
      return newList[0];
    } else {
      return newList.map(name => `\n - ${name}`).join('');
    }
  };

  const _transferTitle = str => {
    if (/(\[)|(\])/g.test(str)) {
      return `'${str}'`;
    } else {
      return str;
    }
  };

  const prefixInfo = [
    '---',
    `title: ${_transferTitle(title)}`,
    `date: ${createdAt}`,
    `categories: ${_generateTagOrCate(categories)}`,
    `tags: ${_generateTagOrCate(tags)}`,
  ];
  return prefixInfo.join('\n');
}

/**
 * getMdFileFromArticle 将文章转为md文件
 * @param {Object} article
 */
async function getMdFileFromArticle(article) {
  return new Promise((resolve, reject) => {
    findOrCreateFileSavePath(outputPath).then(() => {
      const fileName = `${article.title}.md`;
      const writeFilePath = path.join(outputPath, fileName);
      const fileContent = createArticleInfo(article);
      fs.writeFile(writeFilePath, fileContent, function (err) {
        if (err) {
          reject();
          throw err;
        }
        fs.readFile(writeFilePath, function (err, data) {
          if (err) {
            throw err;
          }
          resolve({ filePath: writeFilePath, fileName });
        });
      });
    });
  });
}

module.exports = {
  findOrCreateFileSavePath, // 查找或创建存储文件文件夹
  uploadPath, // 上传文件的目录
  outputPath, // 导出文件的目录
  getContentFromMdFile, // 从md文件中提取文章
  getMdFileFromArticle, // 将文章转成md文件
};

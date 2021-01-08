const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 'lal4$$ala';

// 加密
exports.encrypt = password => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(myPlaintextPassword, (err, salt) => {
      if (err) reject(password);
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) resolve(password);
        resolve(hash);
      });
    });
  });
};

// 解密
exports.comparePassword = (_password, hash) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(_password, hash, (err, isMatch) => {
      if (err) reject(err);
      else resolve(isMatch);
    });
  });
};

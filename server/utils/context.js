const Joi = require('joi');

/**
 * @param {Object} params - 需要被验证的对象
 * @param {Object} schema - 验证规则
 * @return Promise
 */
function validate(params = {}, schema = {}) {
  const ctx = this;
  const validator = Joi.object(schema).validate(params);
  if (validator.error) {
    ctx.throw(400, validator.error.message);
    return false;
  }
  return true;
}
module.exports = {
  validate,
};

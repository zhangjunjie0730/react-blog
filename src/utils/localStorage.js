/**
 * @param {String} key
 */
export const getLocalStorage = key => {
  const value = localStorage.getItem(key);
  if (!value) return null;
  return value.indexOf('{') === 0 || value.indexOf('[') === 0 ? JSON.parse(value) : value;
};

/**
 * @param {String} key
 * @param {any} value
 */
export const saveLocalStorage = (key, value) => {
  const data = typeof value === 'object' ? JSON.stringify(value) : value;
  localStorage.setItem(key, data);
};

/**
 * @param {String} key
 */
export const removeLocalStorage = key => {
  localStorage.removeItem(key);
};

export const clear = () => {
  localStorage.clear();
};

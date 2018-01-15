const randomString = (size, chars) => {
  size = size || 6;
  chars = chars || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const max = chars.length;
  let ret = '';
  for (let i = 0; i < size; i++) {
    ret += chars.charAt(Math.floor(Math.random() * max));
  }
  return ret;
};

// console.log(randomString(20));

module.exports = {randomString};
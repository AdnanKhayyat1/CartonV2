// tools.js

export const uid = () => {
  return (Date.now() + Math.random()).toFixed();
};

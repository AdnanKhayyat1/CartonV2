// tools.js

export const uid = () => {
  return (Date.now() + Math.random()).toFixed();
};

export const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};
export const titleCase = (string) => {
  return string[0].toUpperCase() + string.slice(1).toLowerCase();
}

import { HttpClient } from "./httpClient";

const API = process.env.REACT_APP_DEV_URL;
const TAG_API = `${API}/tag`;

const createTag = async (tag) => {
  const data = await HttpClient.post(TAG_API, tag);
  return data;
};
const getTags = async (userID) => {
  console.log(userID);
  const data = await HttpClient.get(`${TAG_API}/?userID=${userID}`);
  return data;
};
const getTagById = async (id) => {
  const data = await HttpClient.get(`${TAG_API}/${id}`);
  return data;
};
const deleteTagById = async (id) => {
  const data = await HttpClient.delete(`${TAG_API}/${id}`);
  return data;
}
const TagApi = { createTag, getTags, getTagById, deleteTagById };
export { TagApi };

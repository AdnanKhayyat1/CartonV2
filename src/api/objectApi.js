import { HttpClient } from "./httpClient";

const API = process.env.REACT_APP_DEV_URL;
const OBJECT_API = `${API}/obj`;

//create
const createObject = (object) => {
  return HttpClient.post(OBJECT_API, object);
};
//Read ALL
const getObjects = async (userID) => {
  const { data: response } = await HttpClient.get(
    `${OBJECT_API}/?userID=${userID}`
  );
  return response.data;
};
//Read ONE
const getObject = async (id) => {
  const response = await HttpClient.get(`${OBJECT_API}/${id}`);
  return response.data;
};

//Update
const updateObject = async (object) => {
  const response = await HttpClient.put(`${OBJECT_API}/${object._id}`, object);
  return response.data;
};
//Delete
const removeObject = (object) => {
  return HttpClient.delete(`${API}${object._id}`);
};
// Remove tag from all objects
const removeTagFromObjects = async (tagID) => {
  const response = await HttpClient.put(`${API}/tag/${tagID}`);
  return response;
};
//Encapsulating in a JSON object
const ObjectApi = {
  createObject,
  getObjects,
  getObject,
  updateObject,
  removeObject,
  removeTagFromObjects,
};
export { ObjectApi };

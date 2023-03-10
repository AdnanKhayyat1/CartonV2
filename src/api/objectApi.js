import { HttpClient } from "./httpClient";

const API = process.env.REACT_APP_DEV_URL;
const OBJECT_API = `${API}/obj`;

//create
const createObject = (object) => {
  return HttpClient.post(OBJECT_API, object);
};
//Read ALL
const getObjects = async () => {
  const { data:response } = await HttpClient.get(OBJECT_API);
  return response.data;
};
//Read ONE
const getObject = async (id) => {
  const response = await HttpClient.get(`${OBJECT_API}/${id}`);
  return response.data;
};

//Update
const updateObject = (object) => {
  const response = HttpClient.put(`${OBJECT_API}/${object._id}`, object);
  return response.data;
};
//Delete
const removeObject = (object) => {
  return HttpClient.delete(`${API}${object._id}`);
};
//Encapsulating in a JSON object
const ObjectApi = { createObject, getObjects, getObject, updateObject, removeObject };
export { ObjectApi };

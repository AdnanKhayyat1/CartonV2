import { ObjectApi } from "../../api/objectApi.js";

//Create
export const CREATE_OBJECT = "CREATE_OBJECT";
export const CREATE_OBJECT_SUCCESS = "CREATE_OBJECT_SUCCESS";
export const CREATE_OBJECT_ERROR = "CREATE_OBJECT_ERROR";
//Read all
export const GET_OBJECS = "GET_OBJECTS";
export const GET_OBJECTS_SUCCESS = "GET_OBJECTS_SUCCESS";
export const GET_OBJECTS_ERROR = "GET_OBJECTS_ERROR";
//Read one
export const GET_OBJECT = "GET_OBJECT";
export const GET_OBJECT_SUCCESS = "GET_OBJECT_SUCCESS";
export const GET_OBJECT_ERROR = "GET_OBJECT_ERROR";
//Update
export const UPDATE_OBJECT = "UPDATE_OBJECT";
export const UPDATE_OBJECT_SUCCESS = "UPDATE_OBJECT_SUCCESS";
export const UPDATE_OBJECT_ERROR = "UPDATE_OBJECT_ERROR";
//Remove
export const REMOVE_OBJECT = "REMOVE_OBJECT";
export const REMOVE_OBJECT_SUCCESS = "REMOVE_OBJECT_SUCCESS";
export const REMOVE_OBJECT_ERROR = "REMOVE_OBJECT_ERROR";

//Create
//The dispatch and getstate function is provided by the Redux-Thunk middleware, we can dispatch actions with it.
export function CreateObject(object) {
  return (dispatch, getState) => {
    return ObjectApi.createObject(object).then((res) => {
      dispatch(CreateObjectSucess(res.data));
    });
  };
}
export function CreateObjectSucess(object) {
  return {
    type: CREATE_OBJECT_SUCCESS,
    object,
  };
}

//Read all
export function GetObjects() {
  return (dispatch, getState) => {
    return ObjectApi.getObjects().then((res) => {
      dispatch(GetObjectsSuccess(res.data));
    });
  };
}
export function GetObjectsSuccess(objects) {
  return {
    type: GET_OBJECTS_SUCCESS,
    objects,
  };
}

//Read one
export function GetObject(id) {
  return (dispatch, getState) => {
    return ObjectApi.getObject(id).then((res) => {
      dispatch(GetObjectSuccess(res.data));
    });
  };
}
export function GetObjectSuccess(object) {
  return {
    type: GET_OBJECT_SUCCESS,
    object,
  };
}

//Update
export function UpdateObject(object) {
  return (dispatch, getState) => {
    return ObjectApi.updateObject(object).then((res) => {
      dispatch(UpdateObjectSucess(res.data));
    });
  };
}
export function UpdateObjectSucess(object) {
  return {
    type: UPDATE_OBJECT_SUCCESS,
    object,
  };
}

//Remove
export function RemoveObject(id) {
  return (dispatch, getState) => {
    return ObjectApi.removeObject(id).then((res) => {
      dispatch(RemoveObjectSucess(res.data));
    });
  };
}
export function RemoveObjectSucess(object) {
  return {
    type: REMOVE_OBJECT_SUCCESS,
    object,
    _id: object._id,
  };
}

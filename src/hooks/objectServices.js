import { ObjectApi } from "../api/objectApi";

export const updateObjectInServer = (data) => {
    return ObjectApi.updateObject(data);
};
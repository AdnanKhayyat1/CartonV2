import * as ObjectActions from "./actions.js";

export const objectReducer = (state = {}, action) => {
  switch (action.type) {
    case ObjectActions.CREATE_OBJECT_SUCCESS:
      return [...state, action.object];
    case ObjectActions.GET_OBJECTS_SUCCESS:
      return action.objects || [];
    case ObjectActions.UPDATE_OBJECT_SUCCESS:
      return state.data.map((obj) =>
        obj._id === action.object._id ? { ...action.object } : { ...obj }
      );
    case ObjectActions.REMOVE_OBJECT_SUCCESS:
      return state.filter((obj) => obj._id !== action._id);
    default:
      return state;
  }
};

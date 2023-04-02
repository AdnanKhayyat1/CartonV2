import { HttpClient } from "./httpClient";

const API = process.env.REACT_APP_DEV_URL;
const CELL_API = `${API}/cell`;

//create
const createCell = (cell) => {
  return HttpClient.post(CELL_API, cell);
};
//Read ALL
const getCellsByIds = async (cellIDs) => {
  const queryIDS = cellIDs.join(",");
  if (queryIDS !== "") {
    const { data: response } = await HttpClient.get(
      `${CELL_API}/?ids=${queryIDS}`
    );
    return response;
  }

  return [];
};
//Read ONE
const getCell = async (id) => {
  const response = await HttpClient.get(`${CELL_API}/${id}`);
  return response.data;
};

//Update
const updateCell = (cell) => {
  const response = HttpClient.put(`${CELL_API}/${cell._id}`, cell);
  return response;
};
//Delete
const removeCell = (cell) => {
  return HttpClient.delete(`${API}${cell._id}`);
};
// delete tag from all cells
const deleteTagFromCells = async (tagID) => {
  const response = HttpClient.put(`${CELL_API}/tag/${tagID}`);
  return response;

}
//Encapsulating in a JSON cell
const CellApi = { createCell, getCellsByIds, getCell, updateCell, removeCell, deleteTagFromCells};
export { CellApi };

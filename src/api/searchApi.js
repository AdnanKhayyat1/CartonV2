import { HttpClient } from "./httpClient";

const API = process.env.REACT_APP_DEV_SEARCH_URL;
const SEARCH_API = `${API}/search`;

const getSearch = async (q, userID) => {
    const response = await HttpClient.get(`${SEARCH_API}/?prompt=${q}&userID=${userID}`);
    return response.data;
};

const SearchApi = {
    getSearch
};
export { SearchApi };

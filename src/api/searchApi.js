import { HttpClient } from "./httpClient";

const API = process.env.REACT_APP_DEV_SEARCH_URL;
const SEARCH_API = `${API}/search`;

const getSearch = async (q) => {
    const response = await HttpClient.get(`${SEARCH_API}/?prompt=${q}`);
    return response.data;
};

const SearchApi = {
    getSearch
};
export { SearchApi };

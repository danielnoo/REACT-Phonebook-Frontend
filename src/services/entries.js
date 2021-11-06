import axios from "axios";
const baseUrl = "https://murmuring-savannah-09830.herokuapp.com/api/persons";

const entries = {}

entries.getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

entries.create = (newObject) => {
  const request = axios.post(baseUrl, newObject);
  return request.then((response) => response.data);
};

entries.update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject);
  return request.then((response) => response.data);
};

export default entries
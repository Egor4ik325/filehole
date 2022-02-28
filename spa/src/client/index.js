import axios from "axios";

const API_BASE_URL = `http://${window.location.hostname}:8000/api/`;

class File {
  constructor(data) {
    this.id = data.id;
    this.name = data.root_name;
    this.url = data.url;
  }
}

export const listFiles = async () => {
  const response = await axios.get(`${API_BASE_URL}files/`);
  return response.data.map((file) => new File(file));
};

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  await axios.post(`${API_BASE_URL}files/`, formData, {
    headers: { "content-type": "multipart/form-data" },
  });
};

export const deleteFile = async (id) => {
  await axios.delete(`${API_BASE_URL}files/${id}/`);
};

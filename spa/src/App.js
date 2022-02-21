import axios from "axios";
import { useState, useEffect } from "react";
import logo from "./assets/logo.svg";
import { listFiles, uploadFile } from "./client";

const App = () => {
  const [files, setFiles] = useState(undefined);

  const fetchFiles = async () => {
    try {
      setFiles(await listFiles());
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleImageUploadChange = async (e) => {
    const file = e.target.files[0];
    await uploadFile(file);
  };

  return (
    <div>
      Filehole <img src={logo} alt="logo" width={200} />
      {files !== undefined &&
        files.map((file) => (
          <div key={file.id}>
            Name: {file.name}
            <img src={file.url} alt="file" width="100" />
          </div>
        ))}
      <form>
        <input
          name="image"
          type="file"
          accept="image/*"
          onChange={handleImageUploadChange}
        />
      </form>
    </div>
  );
};

export default App;

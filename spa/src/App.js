import { useState, useEffect } from "react";

import Draggable from "react-draggable";
import Uppy from "@uppy/core";
import XHRUpload from "@uppy/xhr-upload"; // Classic ajax multipart/formdata file upload
// import Tus from "@uppy/tus"; // Tus should be used in combination with Tus server
import { useUppy, DragDrop } from "@uppy/react";

import logo from "./assets/logo.svg";
import { listFiles, uploadFile } from "./client";

const App = () => {
  const [files, setFiles] = useState(undefined);

  // Uppy file uploader instance
  const uppy = useUppy(() => {
    return new Uppy({
      autoProceed: true,
      restrictions: {
        maxNumberOfFiles: 1,
        maxFileSize: 100 * 1024 * 1024, // 100 MiB
      },
    }).use(XHRUpload, {
      endpoint: "http://localhost:8000/api/files/",
      method: "post",
      formData: true,
      fieldName: "file",
    });
  });

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
    <div className="app">
      <div className="header"></div>
      Filehole <img src={logo} alt="logo" width={200} />
      <DragDrop
        uppy={uppy}
        width={500}
        height={200}
        note="Files up to 100MiB"
        locale={{
          strings: {
            // Text to show on the droppable area.
            dropHereOr: "Drop here or %{browse}",
            // Used as the label for the link that opens the system file selection dialog.
            browse: "browse",
          },
        }}
      />
      {files !== undefined &&
        files.map((file) => (
          <Draggable key={file.id}>
            <div>
              Name: {file.name}
              <img src={file.url} alt="file" width="100" />
              <a href={file.url} download={file.name}>
                Download
              </a>
            </div>
          </Draggable>
        ))}
      <form>
        <input
          name="image"
          type="file"
          accept="image/*"
          onChange={handleImageUploadChange}
        />
      </form>
      <Draggable>
        <div>Hello, World!</div>
      </Draggable>
    </div>
  );
};

export default App;

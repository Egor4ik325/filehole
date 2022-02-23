import { useState, useEffect } from "react";

import Draggable from "react-draggable";
import Uppy from "@uppy/core";
import Tus from "@uppy/tus";
import { useUppy, DragDrop } from "@uppy/react";

import logo from "./assets/logo.svg";
import { listFiles, uploadFile } from "./client";

const App = () => {
  const [files, setFiles] = useState(undefined);

  // Uppy file uploader instance
  const uppy = useUppy(() => {
    return new Uppy({
      restrictions: { maxNumberOfFiles: 1 },
      autoProceed: true,
    }).use(Tus, {
      endpoint: "https://tusd.tusdemo.net/files",
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
        width="100%"
        height="100%"
        note="Images up to 200×200px"
        locale={{
          strings: {
            // Text to show on the droppable area.
            // `%{browse}` is replaced with a link that opens the system file selection dialog.
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

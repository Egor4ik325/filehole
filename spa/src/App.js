import { useState, useEffect } from "react";

import Draggable from "react-draggable";
import Uppy from "@uppy/core";
import XHRUpload from "@uppy/xhr-upload"; // Classic ajax multipart/formdata file upload
// import Tus from "@uppy/tus"; // Tus should be used in combination with Tus server
import { useUppy, DragDrop } from "@uppy/react";

import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";

import logo from "./assets/logo.svg";
import { listFiles, uploadFile } from "./client";

const checkIsImageUrl = (url) => {
  return url.match(/\.(jpeg|jpg|gif|png|svg)$/) !== null;
};

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
    setFiles(undefined); // clear files before fetching
    try {
      setFiles(await listFiles());
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  uppy.on("upload-success", (file, response) => {
    const uploadFile = JSON.parse(response.body);
    setFiles([...files, uploadFile]);
  });

  const handleFileDelete = (id) => {
    Swal.fire({
      title: "Confirm delete",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    });

    try {
    } catch (error) {
      // display error toast + console log
    }
  };

  return (
    <div className="app">
      <div className="header">
        Filehole <img src={logo} alt="logo" width={200} />
      </div>

      <DragDrop
        uppy={uppy}
        width={500}
        height={200}
        note="Any files up to 100MiB"
        locale={{
          strings: {
            // Text to show on the droppable area.
            dropHereOr: "Drop here or %{browse}",
            // Used as the label for the link that opens the system file selection dialog.
            browse: "browse",
          },
        }}
        // onDrop={fetchFiles}
        onDrop={() => fetchFiles()}
      />
      {files !== undefined &&
        files.map((file) => {
          if (checkIsImageUrl(file.url)) {
            return (
              <Draggable key={file.id}>
                <div>
                  <div>Name: {file.name}</div>
                  <img src={file.url} alt="file" width="100" />
                  <a href={file.url} download={file.name}>
                    Download
                  </a>
                  <button onClick={() => handleFileDelete(file.id)}>
                    Delete
                  </button>
                </div>
              </Draggable>
            );
          }

          return (
            <Draggable key={file.id}>
              <div>
                <div>Name: {file.name}</div>
                <a href={file.url} download={file.name}>
                  Download
                </a>
              </div>
            </Draggable>
          );
        })}
      <Draggable>
        <div>Hello, World!</div>
      </Draggable>
    </div>
  );
};

export default App;

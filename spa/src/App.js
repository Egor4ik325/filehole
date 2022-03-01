import { useState, useEffect } from "react";

import Draggable from "react-draggable";
import Uppy from "@uppy/core";
import XHRUpload from "@uppy/xhr-upload"; // Classic ajax multipart/formdata file upload
// import Tus from "@uppy/tus"; // Tus should be used in combination with Tus server
import { useUppy, DragDrop } from "@uppy/react";
import { toast, ToastContainer } from "react-toastify";

import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import "react-toastify/dist/ReactToastify.css";

import logo from "./assets/logo.png";
import { listFiles, deleteFile, purgeFiles } from "./client";

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

  uppy.on("upload-success", () => fetchFiles());

  const handleFileDelete = async (id) => {
    const { isConfirmed, isDenied, isDismissed } = await Swal.fire({
      title: "Confirm delete",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "No, cancel",
    });

    if (isConfirmed) {
      try {
        await deleteFile(id);
        setFiles(files.filter((file) => file.id !== id));
        toast.success("File was deleted!");
      } catch (error) {
        console.error(error);
        toast.error("Error while deleting file!");
      }
    }
  };

  const handleClearFiles = async () => {
    const { isConfirmed } = await Swal.fire({
      title: "Confirm purge",
      text: "Are you sure you want to delete ALL files?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete all",
      cancelButtonText: "No, STOP",
    });

    if (isConfirmed) {
      try {
        await purgeFiles();
        setFiles(undefined);
        toast.success("Deleted all files");
      } catch (error) {
        console.log(error);
        toast.error("Not able to delete all files!");
      }
    }
  };

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="app">
        <div className="header">
          <div className="header__brand">
            <img className="header__brand__logo" src={logo} alt="logo" />
            <div className="header__brand__text">Filehole</div>
          </div>
          <div>
            <div className="header__copyright">© 2022 Egor Zorin.</div>
            <div className="header__social-icons"></div>
          </div>
        </div>
        <div className="main">
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
                  <Draggable bounds="parent" key={file.id}>
                    <div className="file">
                      <div className="file__meta">Name: {file.name}</div>
                      <img
                        className="file__image"
                        src={file.url}
                        alt="file"
                        width="100"
                      />
                      <a
                        className="file__download"
                        href={file.url}
                        download={file.name}
                      >
                        Download
                      </a>
                      <button
                        className="file__delete"
                        onClick={() => handleFileDelete(file.id)}
                      >
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
          <button onClick={handleClearFiles}>Clear all</button>
        </div>
      </div>
    </>
  );
};

export default App;

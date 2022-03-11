import { useState, useEffect, useRef } from "react";

import Draggable from "react-draggable";
import Uppy from "@uppy/core";
import XHRUpload from "@uppy/xhr-upload"; // Classic ajax multipart/formdata file upload
// import Tus from "@uppy/tus"; // Tus should be used in combination with Tus server
import { useUppy, DragDrop } from "@uppy/react";
import { toast, ToastContainer } from "react-toastify";
import {
  faDownload,
  faTrash,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import "react-toastify/dist/ReactToastify.css";

import logo from "./assets/logo.png";
import { listFiles, deleteFile, purgeFiles } from "./client";

const checkIsImageUrl = (url) => {
  return url.match(/\.(jpeg|jpg|gif|png|svg)$/) !== null;
};

/**
 * Format bytes as human-readable text.
 *
 * @param bytes Number of bytes.
 * @param si True to use metric (SI) units, aka powers of 1000. False to use
 *           binary (IEC), aka powers of 1024.
 * @param dp Number of decimal places to display.
 *
 * @return Formatted string.
 */
function getHumanizedFileSize(bytes, si = false, dp = 1) {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + " B";
  }

  const units = si
    ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (
    Math.round(Math.abs(bytes) * r) / r >= thresh &&
    u < units.length - 1
  );

  return bytes.toFixed(dp) + " " + units[u];
}

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

export default function App() {
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
            className="main__dragdrop"
            uppy={uppy}
            width={350}
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
                  <File
                    file={file}
                    onDelete={() => handleFileDelete(file.id)}
                  />
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
          <FontAwesomeIcon
            className="clear-all icon--hover-darken"
            icon={faTrashCan}
            onClick={handleClearFiles}
          />
        </div>
      </div>
    </>
  );
}

function File({ file, onDelete }) {
  // [-645; 645] = 1290 = window.innerWidth - 130
  const width = window.innerWidth - 130;
  const height = window.innerHeight - 200;

  const [position, setPosition] = useState({
    x: getRandom(0, width),
    y: getRandom(0, height),
  });

  const handleWindowResize = () => {
    // State updater function (state is not updated in event listeners)
    setPosition((position) => {
      let x = position.x;
      let y = position.y;

      if (x + 130 > window.innerWidth) {
        x = window.innerWidth - 130;
      }
      if (x < 0) {
        x = 0;
      }
      if (y + 200 + 40 > window.innerHeight) {
        y = window.innerHeight - 200 - 40;
      }
      if (y < 40) {
        y = 40;
      }

      return { x, y };
    });
  };

  useEffect(() => {
    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  const handleDragStop = (e, data) => {
    // Convert from center coordinated
    setPosition({ x: data.x + width / 2, y: data.y + height / 2 });
  };

  return (
    <Draggable
      bounds="parent"
      key={file.id}
      // Convert to center coordinated
      position={{ x: position.x - width / 2, y: position.y - height / 2 }}
      onStop={handleDragStop}
    >
      <div className="file">
        <div className="file__controls">
          <a
            className="file__controls__download"
            href={file.url}
            download={file.name}
          >
            <FontAwesomeIcon className="icon--hover-darken" icon={faDownload} />
          </a>
          <FontAwesomeIcon
            className="file__controls__delete icon--hover-darken"
            icon={faTrash}
            role="button"
            onClick={() => onDelete()}
          />
        </div>
        <img className="file__image" src={file.url} alt="file" />
        <div className="file__meta">
          <div className="file__meta__name">{file.name}</div>
          <div className="file__meta__size">
            {getHumanizedFileSize(file.size)}
          </div>
        </div>
      </div>
    </Draggable>
  );
}

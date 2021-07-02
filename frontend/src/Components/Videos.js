import axios from "axios";
import React from "react";
const FileDownload = require("js-file-download");

export default function VideoDownloader(props) {
  console.log(props);
  const { video } = props;
  const { _id, title, thumbnail } = video;

  const downloadVideo = async (event) => {
    const videoId = event.target.id;
    const filename = event.target.title;
    console.log(filename);
    axios
      .get("http://localhost:3000/api/downloads/" + videoId + "/downloadfile", {
        responseType: "blob",
      })
      .then((response) => {
        FileDownload(response.data, `${filename}.mp4`);
      });
  };

  const removeVideo = async (event) => {
    const videoId = event.target.title;
    axios
      .delete("http://localhost:3000/api/downloads/" + videoId)
      .then((respsonse) => {
        window.location.reload();
      });
  };

  return (
    <div className="card" style={{ width: "18rem" }}>
      <img src={thumbnail} class="card-img-top" alt="thumbnail" />
      <div className="card-body">
        <h6 className="card-text">{title}</h6>
        <button
          id={_id}
          className="btn btn-success rounded"
          style={{ width: "100px" }}
          onClick={downloadVideo}
          title={title}
        >
          Download
        </button>
        <button
          title={_id}
          className="btn btn-danger rounded"
          onClick={removeVideo}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

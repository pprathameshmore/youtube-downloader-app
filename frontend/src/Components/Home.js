import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { io } from "socket.io-client";
import Videos from "./Videos";

const notify = (msg, { success }) => {
  if (success) {
    return toast.success(msg);
  }
  return toast.error(msg);
};

const socket = io("http://localhost:3000/");

export default function Home() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    socket.on("VIDEO_DOWNLOADED", (data) => {
      notify(`${data} Downloaded`, { success: true });
      window.location.reload();
    });

    socket.on("VIDEO_STARTED", (data) => {
      notify(`Download Started ${data}`, { success: true });
    });

    axios
      .get("http://localhost:3000/api/downloads")
      .then((res) => {
        setVideos(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const downloadVideo = (event) => {
    event.preventDefault();

    const youtubeUrl = event.target.elements.youtubeUrl.value;

    axios
      .post("http://localhost:3000/api/downloads", { youtubeUrl })
      .then((res) => {
        notify("Fetching video details...", { success: true });
      })
      .catch((error) => {
        notify("Something went wrong", { success: false });
      });
  };

  return (
    <div>
      <div class="p-5 mb-4 bg-light rounded-3">
        <div class="container-fluid py-5">
          <h1 class="display-5 fw-bold">
            Download your favorite Youtube videos
          </h1>
        </div>
        <form onSubmit={downloadVideo}>
          <div>
            <label for="youtubeUrl" class="form-label">
              Enter link
            </label>
            <input type="url" id="youtubeUrl" class="form-control" required />
            <div id="urlHelpBlock" class="form-text">
              E.g. https://www.youtube.com/watch?v=PCicKydX5GE
            </div>
            <br />
            <button type="submit" class="btn btn-primary btn-lg">
              Download
            </button>
            <Toaster />
          </div>
        </form>
      </div>
      <h3>Downloaded videos</h3>
      <div style={{ margin: 10 }} className="row">
        {videos.map((video) => {
          console.log(video);
          return <Videos video={video} />;
        })}
      </div>
    </div>
  );
}

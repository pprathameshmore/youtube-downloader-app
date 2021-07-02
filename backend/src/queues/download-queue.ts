import Bull from "bull";
import ytdl from "ytdl-core";
import fs from "fs";
import { Video } from "../models/video";
import { Events } from "../utils";
import { SocketInit } from "../socket.io";

const downloadQueue = new Bull("download queue", {
  redis: {
    host: process.env.REDIS_HOST!,
    port: parseInt(process.env.REDIS_PORT!),
  },
});

downloadQueue.process((job, done) => {
  return new Promise(async (resolve, reject) => {
    const { youtubeUrl } = job.data;

    //Get singleton instance
    const socket = SocketInit.getInstance();

    const info = await ytdl.getBasicInfo(youtubeUrl);

    console.log(info.videoDetails.thumbnails[0].url);

    const thumbnail = info.videoDetails.thumbnails[0].url;

    const title =
      info.videoDetails.title +
      " by " +
      info.videoDetails.author.name +
      "-" +
      new Date().getTime().toString();

    ytdl(youtubeUrl)
      .pipe(fs.createWriteStream(`${process.cwd()}/downloads/${title}.mp4`))
      .on("finish", async () => {
        socket.publishEvent(Events.VIDEO_DOWNLOADED, title);

        console.log("Download complete");

        const file = `${process.cwd()}/downloads/${title}.mp4`;

        const video = new Video({
          title,
          file,
          thumbnail,
        });

        await video.save();

        done();

        resolve({ title });
      })
      .on("ready", () => {
        console.log("Download started");
        socket.publishEvent(Events.VIDEO_STARTED, title);
      })
      .on("error", (error) => {
        socket.publishEvent(Events.VIDEO_ERROR, error);
        done(error);
        reject(error);
      });
  });
});

export { downloadQueue };

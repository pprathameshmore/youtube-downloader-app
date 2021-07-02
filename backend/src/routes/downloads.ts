import express, { Request, Response, NextFunction } from "express";
import fs from "fs/promises";
import { body, validationResult } from "express-validator";
import { downloadQueue } from "../queues/download-queue";
import { Video } from "../models/video";
const downloadsRouter = express.Router();

downloadsRouter.get(
  "/api/downloads",
  async (req: Request, res: Response, next: NextFunction) => {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.status(200).send(videos);
    //await Video.deleteMany();
  }
);

downloadsRouter.get(
  "/api/downloads/:id/downloadfile",
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const video = await Video.findByIdAndDelete(id);

    if (!video) {
      res.status(404).send("Video not found");
    }
    const { file } = video;

    res.status(200).download(file);

    // await Video.findByIdAndDelete(id);
    // await fs.unlink(file);
  }
);

downloadsRouter.post(
  "/api/downloads",
  body("youtubeUrl").isURL(),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { youtubeUrl } = req.body;
      await downloadQueue.add({ youtubeUrl });
      res.status(200).send("Downloading");
    } catch (error) {
      throw error;
    }
  }
);

downloadsRouter.delete(
  "/api/downloads/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const video = await Video.findByIdAndDelete(id);

    if (video) {
      await fs.unlink(video.file!);
    }

    res.status(200).send(video);
  }
);

export { downloadsRouter };

import mongoose from "mongoose";

export interface VideoDoc extends mongoose.Document {
  title: string;
  file: string;
  thumbnail: string;
}

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    file: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Video = mongoose.model<VideoDoc>("video", videoSchema);

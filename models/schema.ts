import mongoose, { Schema, model, models } from "mongoose";

interface IUser {
  name: string;
  email: string;
  credits: number;
}

const UserSchema = new Schema<IUser>(
  {
    name: String,
    email: { type: String, unique: true },
    credits: { type: Number, default: 5 },
  },
  { timestamps: true }
);

interface IProject {
  projectId: string;
  userInput: string;
  device: string;
  config?: any;
  userId: string;
}

const ProjectSchema = new Schema<IProject>(
  {
    projectId: { type: String, unique: true },
    userInput: String,
    device: String,
    config: Schema.Types.Mixed,
    userId: String,
  },
  { timestamps: true }
);

export const User = models.User || model<IUser>("User", UserSchema);
export const Project = models.Project || model<IProject>("Project", ProjectSchema);

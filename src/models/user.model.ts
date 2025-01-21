import mongoose from "mongoose";

export interface User {
  fullName: string;
  userName: string;
  email: string;
  password: string;
  role: string;
  profilePicture: string;
  isActive: boolean;
  activationCode: string;
}

const Schema = mongoose.Schema;

const UserSchema = new Schema<User>(
  {
    fullName: {
      type: Schema.Types.String,
      required: true,
    },
    userName: {
      type: Schema.Types.String,
      required: true,
    },
    email: {
      type: Schema.Types.String,
      required: true,
    },
    password: {
      type: Schema.Types.String,
      required: true,
    },
    role: {
      type: Schema.Types.String,
      enum: ["admin", "user"],
      default: "user",
    },
    profilePicture: {
      type: Schema.Types.String,
      default: "user.jpg",
    },
    isActive: {
      type: Schema.Types.Boolean,
      required: false,
    },
    activationCode: {
      type: Schema.Types.String,
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("user", UserSchema);

export default UserModel;

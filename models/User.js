// models/User.js
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import bcrypt from "bcrypt";

const AVATAR_PATH = path.join("/uploads/users/avatars");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    avatarUrl: {
      type: String,
      default:''
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        default: [],
      },
    ],
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Friendship",
        default: [],
      },
    ],
    friendsName: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    resetToken: {
      type: String,
      default: null,
    },
    resetTokenExpiry: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "public", AVATAR_PATH));
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.statics.uploadedAvatar = multer({ storage: storage }).single(
  "avatar"
);
userSchema.statics.avatarPath = AVATAR_PATH;

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;

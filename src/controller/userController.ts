import express, { Response } from "express";
import { TRequest as Request } from "../index";
import { Op } from "sequelize";
import db from "../../dbData/models";
const jwt = require("jsonwebtoken");
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import path from "path";
import { uploadImage, deleteImage } from "../services/cloudBacblaze";

exports.getAllUsers = async (req: Request, res: Response) => {
  try {
    const user: any = await db.User.findOne({
      where: { uuid: req.userData.uuid },
    });
    if (user) {
      const allUsers: any = await db.User.findAll({
        where: { uuid: { [Op.not]: req.userData.uuid } },
      });
      return res
        .status(200)
        .json({ msg: "Valid response.", data: allUsers, errors: [] });
    } else {
      return res
        .status(200)
        .json({ msg: "No content available.", data: [], errors: [] });
    }
  } catch (err) {
    if (!err) {
      return res
        .status(500)
        .json({ msg: "Something wrong.", data: [], errors: [] });
    } else {
      return res
        .status(500)
        .json({ msg: "Something wrong.", data: [], error: err });
    }
  }
};

exports.createUser = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ msg: "Inavalid input.", data: [], errors: errors.array() });
    }
    const { name, email, password } = req.body;
    const imgData: any = await uploadImage(req);
    const hashPass = await bcrypt.hash(password, 2);
    await db.User.create({
      name,
      email,
      password: hashPass,
      profileUrl: imgData.path,
      profileFileId: imgData.fileId,
    });
    return res
      .status(200)
      .json({ msg: "User created successfully.", data: [], errors: [] });
  } catch (err) {
    if (!err) {
      return res
        .status(500)
        .json({ msg: "Something wrong.", data: [], errors: [] });
    } else {
      return res
        .status(500)
        .json({ msg: "Something wrong.", data: [], error: err });
    }
  }
};

exports.getUserInfo = async (req: Request, res: Response) => {
  try {
    if (req.userData.uuid == req.params.uuid) {
      const user: any = await db.User.findOne({
        where: { uuid: req.params.uuid },
      });
      if (user) {
        return res
          .status(200)
          .json({ msg: "Valid response.", data: user, errors: [] });
      } else {
        return res
          .status(200)
          .json({ msg: "No content available.", data: [], errors: [] });
      }
    } else {
      return res
        .status(401)
        .json({ msg: "Request was unauthorised.", data: [], errors: [] });
    }
  } catch (err) {
    if (!err) {
      return res
        .status(500)
        .json({ msg: "Something wrong.", data: [], errors: [] });
    } else {
      return res
        .status(500)
        .json({ msg: "Something wrong.", data: [], error: err });
    }
  }
};

exports.deleteUser = async (req: Request, res: Response) => {
  try {
    const user: any = await db.User.findOne({
      where: { uuid: req.params.uuid },
    });
    const filename = path.parse(user.profileUrl).base;
    if (user) {
      // Delete Image
      if (user.profileFileId) {
        const deleteImg: any = await deleteImage(user.profileFileId, filename);
      }

      await user.destroy();
      return res
        .status(200)
        .json({ msg: "User deleted successfully.", data: [], errors: [] });
    } else {
      return res
        .status(200)
        .json({ msg: "No content available.", data: [], errors: [] });
    }
  } catch (err) {
    if (!err) {
      return res
        .status(500)
        .json({ msg: "Something wrong.", data: [], errors: [] });
    } else {
      return res
        .status(500)
        .json({ msg: "Something wrong.", data: [], error: err });
    }
  }
};

exports.updateUser = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ msg: "Invalid input", data: [], errors: errors.array() });
    }
    if (req.userData.uuid == req.params.uuid) {
      const { name, email, password } = req.body;
      const user: any = await db.User.findOne({
        where: { uuid: req.params.uuid },
      });
      const filename = path.parse(user.profileUrl).base;
      if (user) {
        if (name) {
          user.name = name;
        }
        if (email) {
          user.email = email;
        }
        if (password) {
          const hashPass = await bcrypt.hash(password, 2);
          user.password = hashPass;
        }
        if (req.files.length !== 0) {
          if (user.profileFileId) {
            const deleteImg: any = await deleteImage(
              user.profileFileId,
              filename
            );
          }
          const imgData: any = await uploadImage(req);
          user.profileUrl = imgData.path;
          user.profileFileId = imgData.fileId;
        }
        user.save();
        return res
          .status(200)
          .json({ msg: "User updated successfully.", data: [], errors: [] });
      } else {
        return res
          .status(200)
          .json({ msg: "No content available.", data: [], errors: [] });
      }
    } else {
      return res
        .status(401)
        .json({ msg: "Request was unauthorised.", data: [], errors: [] });
    }
  } catch (err) {
    if (!err) {
      return res
        .status(500)
        .json({ msg: "Something wrong.", data: [], errors: [] });
    } else {
      return res
        .status(500)
        .json({ msg: "Something wrong.", data: [], error: err });
    }
  }
};

exports.userLogin = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ msg: "Invalid input", data: [], errors: errors.array() });
    }
    const { email, password } = req.body;
    const user: any = await db.User.findOne({ where: { email: email } });
    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({
          msg: "The credentials are missing or are wrong.",
          data: [],
          errors: [],
        });
      }
      const userData = {
        uuid: user.uuid,
        id: user.id,
      };
      // const authToken = jwt.sign(userData, process.env.MY_SECRET, { expiresIn: "100000" });
      const authToken = jwt.sign(userData, process.env.MY_SECRET);
      return res.status(200).json({
        msg: "Valid response",
        data: [{ authToken: authToken }],
        errors: errors.array(),
      });
    } else {
      return res
        .status(200)
        .json({ msg: "No content available.", data: [], errors: [] });
    }
  } catch (err) {
    if (!err) {
      return res
        .status(500)
        .json({ msg: "Something wrong.", data: [], errors: [] });
    } else {
      return res
        .status(500)
        .json({ msg: "Something wrong.", data: [], error: err });
    }
  }
};

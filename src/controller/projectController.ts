import { Response } from "express";
import { TRequest as Request } from "../index";
import db from "../../dbData/models";
import { validationResult } from "express-validator";

exports.createProject = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ msg: "Invalid input data.", data: [], errors: errors.array() });
    }
    if (req.params.id == req.userData.id) {
      const { title, status } = req.body;
      await db.Project.create({
        title,
        status,
        userId: req.params.id,
      });
      return res.status(200).json({
        msg: "Project created successfully.",
        data: [],
        errors: errors.array(),
      });
    } else {
      return res.status(401).json({
        msg: "Request was unauthorised.",
        data: [],
        errors: errors.array(),
      });
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

exports.getAllProject = async (req: Request, res: Response) => {
  try {
    if (req.params.id == req.userData.id) {
      const projects: any = await db.Project.findAll({
        where: { userId: req.params.id },
      });
      return res
        .status(200)
        .json({ msg: "Valid response.", data: projects, errors: [] });
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

exports.getSinglProject = async (req: Request, res: Response) => {
  try {
    const project: any = await db.Project.findOne({
      where: { uuid: req.params.uuid, userId: req.userData.id },
    });
    if (project) {
      return res
        .status(200)
        .json({ msg: "Valid response.", data: project, errors: [] });
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

exports.deleteProject = async (req: Request, res: Response) => {
  try {
    const project: any = await db.Project.findOne({
      where: { uuid: req.params.uuid, userId: req.userData.id },
    });
    if (project) {
      await project.destroy();
      return res
        .status(200)
        .json({ msg: "Project deleted successfully.", data: [], errors: [] });
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

exports.updateProject = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ msg: "Invalid input data.", data: [], errors: errors.array() });
    }
    const project: any = await db.Project.findOne({
      where: { uuid: req.params.uuid, userId: req.userData.id },
    });
    const { title, status } = req.body;
    if (project) {
      if (title) {
        project.title = title;
      }
      if (status) {
        project.status = status;
      }
      project.save();
      return res
        .status(200)
        .json({ msg: "Project updated successfully.", data: [], errors: [] });
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

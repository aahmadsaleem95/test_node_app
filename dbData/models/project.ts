'use strict';

import { UUIDV4 } from "sequelize";

const {
  Model
} = require('sequelize');

interface ProjectAttributes{
  uuid: string;
  title: string;
  status: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Project extends Model<ProjectAttributes>
  implements ProjectAttributes {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // Not null value of the interface ProjectAttributes
    uuid!: string;
    title!: string;
    status!: string;

    static associate(models: any) {
      // define association here
      Project.belongsTo(models.User, { foreignKey: 'userId', as: 'user' })
      // models.User.hasMany(models.Post, { foreignKey: 'userId', as: 'posts' })
    }
  }
  Project.init({
    uuid:{
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: UUIDV4
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Project must have a Project title" },
        notEmpty: { msg: "Project title must not be empty" },
        len: [5, 20]
      }
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Status must have selected" },
        notEmpty: { msg: "Status must not be empty" }
      }
    }
  }, {
    sequelize,
    tableName: 'projects',
    modelName: 'Project',
  });
  return Project;
};
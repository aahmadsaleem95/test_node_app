"use strict";

import { UUIDV4 } from "sequelize";

import { Model } from "sequelize";

interface UserAttributes {
  uuid: string;
  name: string;
  email: string;
  password: string;
  profileUrl: string;
  profileFileId: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class User extends Model<UserAttributes> implements UserAttributes {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // Not null value of the interface UserAttributes
    uuid!: string;
    name!: string;
    email!: string;
    password!: string;
    profileUrl!: string;
    profileFileId!: string;

    static associate(models: any) {
      // define association here
      User.hasMany(models.Project, { foreignKey: "userId", as: "projects" });
    }
  }
  User.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "User must have a User name" },
          notEmpty: { msg: "User Name must not be empty" },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: { msg: "User must have a Unique Email" },
          notEmpty: { msg: "Email must not be empty" },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [5, 100],
        },
      },
      profileUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      profileFileId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "users",
      modelName: "User",
    }
  );
  return User;
};

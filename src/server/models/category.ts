import { Model, DataTypes, Sequelize } from "sequelize";

const sequelize = new Sequelize("cinema-booking-app-db", "admin", "Giang@123", {
  host: "localhost",
  dialect: "mysql",
  dialectModule: require("mysql2"),
  port: 8000,
  logging: console.log,
});

export class Category extends Model {
  declare id: number;
  declare categoryName: string;
  declare isActive: number;
}

Category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    categoryName: {
      type: DataTypes.STRING,
    },
    isActive: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    modelName: "Category",
    tableName: "category",
    timestamps: false,
  }
);

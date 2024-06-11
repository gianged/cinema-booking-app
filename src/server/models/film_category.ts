import { Model, DataTypes, Sequelize } from "sequelize";
//import { sequelize } from "../server";
import { Category } from "./category";
import { Film } from "./film";

const sequelize = new Sequelize("cinema-booking-app-db", "admin", "Giang@123", {
  host: "localhost",
  dialect: "mysql",
  dialectModule: require("mysql2"),
  port: 8000,
  logging: console.log,
});

export class FilmCategory extends Model {
  declare filmId: number;
  declare categoryId: number;
}

FilmCategory.init(
  {
    filmId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: Film,
        key: "id",
      },
    },
    categoryId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: Category,
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "FilmCategory",
    tableName: "film_category",
    timestamps: false,
  }
);

FilmCategory.belongsTo(Film, { foreignKey: "filmId", onDelete: "CASCADE", onUpdate: "CASCADE" });
FilmCategory.belongsTo(Category, {
  foreignKey: "categoryId",
  onDelete: "SET NULL",
  onUpdate: "SET NULL",
});
Film.hasMany(FilmCategory, { foreignKey: "filmId", onDelete: "CASCADE", onUpdate: "CASCADE" });
Category.hasMany(FilmCategory, {
  foreignKey: "categoryId",
  onDelete: "SET NULL",
  onUpdate: "SET NULL",
});

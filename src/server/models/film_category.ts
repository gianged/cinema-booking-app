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

  declare Film: Film;
  declare Category: Category;
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

FilmCategory.belongsTo(Film, { foreignKey: "filmId" });
FilmCategory.belongsTo(Category, { foreignKey: "categoryId" });
Film.hasMany(FilmCategory, { foreignKey: "filmId" });
Category.hasMany(FilmCategory, { foreignKey: "categoryId" });

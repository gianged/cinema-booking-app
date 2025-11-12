import { DataTypes, Model } from "sequelize";
import sequelize from "../database";

export class Film extends Model {
    declare id: number;
    declare filmName: string;
    declare filmDescription: string;
    declare poster: Buffer;
    declare backdrop: Buffer;
    declare premiere: Date;
    declare trailer: string;
    declare isActive: number;

    // declare categories: string;
}

Film.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        filmName: {
            type: DataTypes.STRING,
        },
        filmDescription: {
            type: DataTypes.STRING,
        },
        poster: {
            type: DataTypes.BLOB,
        },
        backdrop: {
            type: DataTypes.BLOB,
        },
        premiere: {
            type: DataTypes.DATE,
        },
        trailer: {
            type: DataTypes.STRING,
        },
        isActive: {
            type: DataTypes.TINYINT,
            defaultValue: 1,
        },
        categories: {
            type: DataTypes.VIRTUAL,
            get(this: any) {
                if (this.get("FilmCategories")) {
                    return this.get("FilmCategories")
                        .map((categories: any) => categories.Category.categoryName)
                        .join(", ");
                }
                return "";
            },
        },
    },
    {
        sequelize,
        modelName: "Film",
        tableName: "film",
        timestamps: false,
    }
);

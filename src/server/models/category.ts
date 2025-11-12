import { DataTypes, Model } from "sequelize";
import sequelize from "../database";

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

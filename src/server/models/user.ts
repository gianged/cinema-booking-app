import { DataTypes, Model } from "sequelize";
import sequelize from "../database";

export class User extends Model {
    declare id: number;
    declare username: string;
    declare password: string;
    declare role: string;
    declare isActive: number;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.STRING,
            defaultValue: "u",
        },
        isActive: {
            type: DataTypes.TINYINT,
            defaultValue: 1,
        },
    },
    {
        sequelize,
        modelName: "User",
        tableName: "user",
        timestamps: false,
    }
);

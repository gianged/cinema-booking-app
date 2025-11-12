import { DataTypes, Model } from "sequelize";
import sequelize from "../database";
import { Film } from "./film";

export class ShowSchedule extends Model {
    declare id: number;
    declare film: string;
    declare showPrice: number;
    declare beginTime: Date;
    declare endTime: Date;
    declare room: string;
    declare isActive: number;
}

ShowSchedule.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        film: {
            type: DataTypes.STRING,
            references: {
                model: Film,
                key: "id",
            },
        },
        showPrice: {
            type: DataTypes.INTEGER,
        },
        showDay: {
            type: DataTypes.DATE,
        },
        beginTime: {
            type: DataTypes.TIME,
        },
        endTime: {
            type: DataTypes.TIME,
        },
        room: {
            type: DataTypes.STRING,
        },
        isActive: {
            type: DataTypes.INTEGER,
        },
        filmName: {
            type: DataTypes.VIRTUAL,
            get(this: any) {
                if (this.get("Film")) {
                    return this.get("Film").filmName;
                }
                return "";
            },
        },
    },
    {
        sequelize,
        modelName: "ShowSchedule",
        tableName: "show_schedule",
        timestamps: false,
    }
);

ShowSchedule.belongsTo(Film, {foreignKey: "film", onDelete: "CASCADE", onUpdate: "CASCADE"});
Film.hasMany(ShowSchedule, {foreignKey: "film", onDelete: "CASCADE", onUpdate: "CASCADE"});

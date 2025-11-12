import { DataTypes, Model } from "sequelize";
import sequelize from "../database";
import { ShowSchedule } from "./show_schedule";
import { User } from "./user";

export class Ticket extends Model {
    declare idTicket: number;
    declare idUser: number;
    declare idShow: number;
    declare ticketAmount: number;
    declare totalPrice: number;
}

Ticket.init(
    {
        idTicket: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        idUser: {
            type: DataTypes.INTEGER,
            references: {
                model: User,
                key: "idUser",
            },
        },
        idShow: {
            type: DataTypes.INTEGER,
            references: {
                model: ShowSchedule,
                key: "id",
            },
        },
        ticketAmount: {
            type: DataTypes.INTEGER,
        },
        totalPrice: {
            type: DataTypes.INTEGER,
        },
        filmName: {
            type: DataTypes.VIRTUAL,
            get(this: any) {
                if (this.get("ShowSchedule")) {
                    return this.get("ShowSchedule").Film.filmName;
                }
                return "";
            },
        },
        username: {
            type: DataTypes.VIRTUAL,
            get(this: any) {
                if (this.get("User")) {
                    return this.get("User").username;
                }
                return "";
            },
        },
        showDay: {
            type: DataTypes.VIRTUAL,
            get(this: any) {
                if (this.get("ShowSchedule")) {
                    return this.get("ShowSchedule").showDay;
                }
                return "";
            },
        },
        showTime: {
            type: DataTypes.VIRTUAL,
            get(this: any) {
                if (this.get("ShowSchedule")) {
                    return `${this.get("ShowSchedule").BeginTime} - ${this.get("ShowSchedule").endTime}`;
                }
                return "";
            },
        },
    },
    {
        sequelize,
        modelName: "Ticket",
        tableName: "ticket",
        timestamps: false,
    }
);

Ticket.belongsTo(User, {foreignKey: "idUser", onDelete: "CASCADE", onUpdate: "CASCADE"});
Ticket.belongsTo(ShowSchedule, {
    foreignKey: "idShow",
    onDelete: "SET NULL",
    onUpdate: "SET NULL",
});
User.hasMany(Ticket, {foreignKey: "idUser", onDelete: "CASCADE", onUpdate: "CASCADE"});
ShowSchedule.hasMany(Ticket, {foreignKey: "idShow", onDelete: "SET NULL", onUpdate: "SET NULL"});

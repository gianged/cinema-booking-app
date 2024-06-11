import { Model, DataTypes, Sequelize } from "sequelize";
import { ShowSchedule } from "./show_schedule";
import { User } from "./user";

const sequelize = new Sequelize("cinema-booking-app-db", "admin", "Giang@123", {
  host: "localhost",
  dialect: "mysql",
  dialectModule: require("mysql2"),
  port: 8000,
  logging: console.log,
});

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
      allowNull: false,
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
  },
  {
    sequelize,
    modelName: "Ticket",
    tableName: "ticket",
    timestamps: false,
  }
);

Ticket.belongsTo(User, { foreignKey: "idUser", onDelete: "CASCADE", onUpdate: "CASCADE" });
Ticket.belongsTo(ShowSchedule, {
  foreignKey: "idShow",
  onDelete: "SET NULL",
  onUpdate: "SET NULL",
});
User.hasMany(Ticket, { foreignKey: "idUser", onDelete: "CASCADE", onUpdate: "CASCADE" });
ShowSchedule.hasMany(Ticket, { foreignKey: "idShow", onDelete: "SET NULL", onUpdate: "SET NULL" });

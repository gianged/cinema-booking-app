import { DataTypes, Model, Sequelize } from "sequelize";
import { Film } from "./film";
import { User } from "./user";

const sequelize = new Sequelize("cinema-booking-app-db", "admin", "Giang@123", {
    host: "localhost",
    dialect: "mysql",
    dialectModule: require("mysql2"),
    port: 8000,
    logging: console.log,
});

export class Review extends Model {
    declare id: number;
    declare filmId: number;
    declare userId: number;
    declare rate: number;
    declare content: string;
}

Review.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        filmId: {
            type: DataTypes.INTEGER,
            references: {
                model: Film,
                key: "id",
            },
        },
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: User,
                key: "id",
            },
        },
        rate: {
            type: DataTypes.FLOAT,
        },
        content: {
            type: DataTypes.STRING,
        },
    },
    {
        sequelize,
        modelName: "Review",
        tableName: "review",
        timestamps: false,
    }
);

Review.belongsTo(Film, {foreignKey: "filmId", onDelete: "CASCADE", onUpdate: "CASCADE"});
Review.belongsTo(User, {foreignKey: "userId", onDelete: "CASCADE", onUpdate: "CASCADE"});
Film.hasMany(Review, {foreignKey: "filmId", onDelete: "CASCADE", onUpdate: "CASCADE"});
User.hasMany(Review, {foreignKey: "userId", onDelete: "CASCADE", onUpdate: "CASCADE"});

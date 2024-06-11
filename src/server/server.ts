import express from "express";
import { Sequelize } from "sequelize";
import mysql from "mysql2";
import cors from "cors";
import userRouter from "./api/userRoute";
import filmRouter from "./api/filmRoute";
import showRouter from "./api/showRoute";

const app = express();
const host = "localhost";
const port = 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, host, () => {
  console.log(`Server is running on port ${host}:${port}`);
});

//test connection
export const sequelize = new Sequelize("cinema-booking-app-db", "admin", "Giang@123", {
  host: "localhost",
  dialect: "mysql",
  dialectModule: mysql,
  port: 8000,
  logging: console.log,
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

//middleware
app.use("/security", userRouter);
app.use(filmRouter);
app.use(showRouter);

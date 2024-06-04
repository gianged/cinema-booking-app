import express from "express";
import mysql from "mysql2";
import cors from "cors";
import userRouter from "./api/user";
import filmRouter from "./api/film";

const app = express();
const host = "localhost";
const port = 4000;

// parse requests of content-type - application/json
// app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: true }));

export const connection = mysql.createConnection({
  host: "localhost",
  port: 8000,
  user: "admin",
  password: "Giang@123",
  database: "cinema-booking-app-db",
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, host, () => {
  console.log(`Server is running on port ${host}:${port}`);
});

// app.get("/", (req, res) => {
//   res.json({ message: "Welcome to Cinema Booking App" });
// });

//middleware
app.use("/security", userRouter);
app.use(filmRouter);

connection.connect((err) => {
  if (err) {
    console.error("Connection failed: ", err);
    process.exit(1);
  }

  console.log("Connected to MySQL server");
});

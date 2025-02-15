import express from "express";
import morgan from "morgan";
import router from "./routes/index.js";
import cors from "cors";
const app = express();
const port = process.env.PORT || 5000;

// Setting headers to link frontend and backend
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   next();
// });
app.use("/api", router);

app.listen(port, () => {
  console.log(`Server running and listening on port ${port}`);
});

export default app;
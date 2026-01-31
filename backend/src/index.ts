import "dotenv/config";
import express from "express";
import eventsController from "./ingestion/events.controller.js";

const app = express();
app.use(express.json());

app.use("/events", eventsController);

app.listen(3000, () => {
  console.log("Backend running on port 3000");
});
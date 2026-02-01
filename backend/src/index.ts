import "dotenv/config";
import express from "express";
import eventsController from "./ingestion/events.controller.js";
import triggersController from "./api/triggers.controller.js";


const app = express();
app.use(express.json());

app.use("/events", eventsController);
app.use("/api/triggers", triggersController);
app.listen(3000, () => {
  console.log("Backend running on port 3000");
});
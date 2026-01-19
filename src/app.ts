import express from "express";
import cors from "cors";

import interestRoutes from "./routes/interest.routes";


const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/interests", interestRoutes);


export default app;

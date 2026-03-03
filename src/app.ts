import express from "express";
import cors from "cors";

import interestRoutes from "./routes/interest.routes";
import skillRoutes from "./routes/skills.routes";



const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/interests", interestRoutes);
app.use("/api/skills", skillRoutes);


export default app;

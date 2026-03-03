import express from "express";
import cors from "cors";

import userRoutes from "./routes/user.routes"
import userInterestRoutes from "./routes/userInterest.routes";
import interestRoutes from "./routes/interest.routes";
import skillRoutes from "./routes/skills.routes";
import questionRoutes from "./routes/question.routes";


const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/user-interests", userInterestRoutes);
app.use("/api/interests", interestRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/questions", questionRoutes);

export default app;

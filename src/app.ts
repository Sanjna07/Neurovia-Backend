import express from "express";
import cors from "cors";

import userRoutes from "./routes/user.routes"
import userInterestRoutes from "./routes/userInterest.routes";
import interestRoutes from "./routes/interest.routes";
import skillRoutes from "./routes/skills.routes";
import questionRoutes from "./routes/question.routes";
import optionsRoutes from "./routes/options.routes";
import aiRoutes from "./routes/ai.routes";
import quizRoutes from "./routes/quiz.routes";
import analyticsRoutes from "./routes/analytics.routes";
import recommendationRoutes from "./routes/recommendation.routes";
import testRoutes from "./routes/test.routes";


const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/user-interests", userInterestRoutes);
app.use("/api/interests", interestRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/options", optionsRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/test", testRoutes);

export default app;

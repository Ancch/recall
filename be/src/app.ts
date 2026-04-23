import express from "express"
import authRoute from "./routes/authRoutes";
import contentRoutes from "./routes/contentRoutes";
import shareRoute from "./routes/shareRoutes";
import searchRoute from "./routes/searchRoutes";

const app = express();

app.use(express.json());

app.use("/api/v1", authRoute);
app.use("/api/v1/content", contentRoutes);
app.use("/api/v1/search", searchRoute);
app.use("/api/v1/share", shareRoute);

export default app;
import express from "express"
import authRoute from "./routes/authRoutes";
import contentRoutes from "./routes/contentRoutes";
import shareRoute from "./routes/shareRoutes";
import searchRoute from "./routes/searchRoutes";
import cors from "cors";

const app = express();
const allowedOrigins = [
  "https://consciousapp.vercel.app",
  "https://cronify-web-rho.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

app.use("/api/v1", authRoute);
app.use("/api/v1/content", contentRoutes);
app.use("/api/v1/search", searchRoute);
app.use("/api/v1/share", shareRoute);

export default app;
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
  ],
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/", productRoutes);
app.use("/", userRoutes);

// Connect to DB and start server
await connectDB();

app.get("/", async (req, res) => {
  res.send("EzyBazaar Server is Running!");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

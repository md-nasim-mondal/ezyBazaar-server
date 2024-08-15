import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", productRoutes);

app.get("/", async (req, res) => {
  res.send("EzyBazaar Server is Running!");
});

const run = async () => {
    // Connect to DB and start server
    await connectDB();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};


run().catch(console.dir);
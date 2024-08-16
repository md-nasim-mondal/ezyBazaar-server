import express from "express";
import jwt from "jsonwebtoken";
import { getDB } from "../config/db.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

const usersCollection = getDB().collection("users");

// JWT authentication
router.post("/jwt", async (req, res) => {
  const user = req.body;
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "24h",
  });
  res
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    })
    .send({ success: true });
});

// Protected route example using verifyToken middleware
router.get("/protected-route", verifyToken, async (req, res) => {
  res.send({ message: "This is a protected route!" });
});

// Logout
router.get("/logout", async (req, res) => {
  try {
    res
      .clearCookie("token", {
        maxAge: 0,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      })
      .send({ success: true });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Save user data in db
router.post("/user", async (req, res) => {
  const user = req.body;
  const query = { email: user?.email };
  // Check if user already exists in db
  const isExist = await usersCollection.findOne(query);
  if (isExist) {
    // If existing user logs in again
    return res.send("already existing!!");
  }

  // Save user for the first time
  const userDoc = {
    ...user,
    timestamp: Date.now(),
  };
  const result = await usersCollection.insertOne(userDoc);
  res.send(result);
});

export default router;

import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";
import User from "./model/User.js";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log(err));

const verifyToken = (req, res, next) => {
    const token = req.header("x-auth-token");

    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        next(); 
    } catch (err) {
        res.status(401).json({ message: "Token is not valid" });
    }
};

app.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token, message: "Login successful" });
    } catch (err) {
        res.status(500).json({ message: "Server error. Please try again later." });
    }
});

app.get("/user-dashboard", verifyToken, (req, res) => {
    if (req.user.role === 'admin') {
        res.json({ message: "Welcome to the admin dashboard" });
    } else {
        res.json({ message: "Welcome to the user dashboard" });
    }
});

import Complaint from "./model/Complaint.js";

// User submits a complaint
app.post("/complaint", verifyToken, async (req, res) => {
  try {
    const newComplaint = new Complaint({
      user: req.user.id,
      text: req.body.complaint,
    });
    await newComplaint.save();
    res.status(201).json({ message: "Complaint submitted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin fetches all complaints
app.get("/complaints", verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Access denied" });
  }
  try {
    const complaints = await Complaint.find().populate("user", "username");
    res.json({ complaints });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Admin responds to a complaint
app.post("/complaint/:id/response", verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Access denied" });
  }
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    complaint.response = req.body.response;
    await complaint.save();
    res.json({ response: complaint.response });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/user/complaints", verifyToken, async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user.id });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

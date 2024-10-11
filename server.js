const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect("", {useNewUrlParser:true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    points: Number
});

const User = mongoose.model("User", userSchema);

app.post("/signup", async(req, res) => {
    const {username, password} = req.body;
    const newUser = new User({username, password, points: 0});
    await newUser.save();
    res.status(201).send("Account Created");
});

app.post("/updatePoints", async (req, res) => {
    const {username, points} = req.body;
    await User.updateOne({username}, {$inc: {points: points}});
    res.send("Points have been updated");
});

app.listen(port, () => {
    console.log(`Server is running on xxxxxx`);
});
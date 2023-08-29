const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3001;

;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Path: note-taker-application/public/index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
    });


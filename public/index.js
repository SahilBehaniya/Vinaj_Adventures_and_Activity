const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const usercollection = require("./model");
const fs = require("fs");

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", path.resolve("views"));
app.use(express.static(path.resolve("./")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://yashmeshram239:Yash123@studentdetails.qf7rbm6.mongodb.net/restaurant?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Database connected");
  })
  .catch(() => {
    console.log("Database not connected");
  });

app.get("/down", (req, res) => {
  res.render("down");
});

app.get("/download", async (req, res) => {
  try {
    const users = await usercollection.find();

    if (users.length === 0) {
      return res.send("No data available for download.");
    }

    const filePath = './userdata.csv';
    const csvContent =
      "Full_Name,Email,Mob_no,Message\n" +
      users
        .map(
          (user) =>
            `${user.Full_Name},${user.Email},${user.Mob_no},${user.Message}`
        )
        .join("\n");

    fs.writeFile(filePath, csvContent, (err) => {
      if (err) {
        console.error(err);
        return res.send("An error occurred while creating the file.");
      }

      res.download(filePath, 'userdata.csv', (err) => {
        if (err) {
          console.error(err);
          res.send('Error in downloading the file.');
        }
        fs.unlinkSync(filePath);
      });
    });
  } catch (error) {
    console.error(error);
    res.send("An error occurred while retrieving data from the database.");
  }
});

app.get("/", (req, res) => {
  res.sendFile("index");
});

app.post("/login", (req, res) => {
  const us = req.body.username;
  const pass = req.body.password;
  if (us === "sahil" && pass === "sahil@123") {
    res.redirect("down");
  } else {
    res.send("Wrong Username and Password");
  }
});

app.post("/contact", async (req, res) => {
  const checkuser = req.body.email;

  const finduser = await usercollection.findOne({ Email: checkuser });
  if (finduser) {
    res.send("Email Already Exist");
  } else {
    const userOb = await usercollection.create({
      Full_Name: req.body.name,
      Email: req.body.email,
      Mob_no: req.body.Mob_no,
      Message: req.body.message,
    });

    res.send("success");
  }
});

app.listen(port, () => {
  console.log(`Server is started in running ${port}`);
});

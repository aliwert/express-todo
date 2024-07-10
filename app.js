"use strict";

const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 8000;
require("express-async-errors");

app.use(express.json());

const { DataTypes, Sequelize } = require("sequelize");
const sequelize = new Sequelize(
  "sqlite:" + (process.env.SQLITE || "./db.sqlite3")
);

const Todo = sequelize.define("todos", {
  title: {
    type: DataTypes.STRING(256),
    allowNull: false,
  },
  description: DataTypes.TEXT,
  priority: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0,
  },
  isDone: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

sequelize
  .authenticate()
  .then(() => console.log("succesfull"))
  .catch(() => console.log("failed"));

const router = express.Router();

router.get("/todo", async (req, res) => {
  const data = await Todo.findAll();
  res.status(200).send({
    error: false,
    result: data,
  });
});

router.post("/todo", async (req, res) => {
  const data = await Todo.create(req.body);
});

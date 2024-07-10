"use strict";

const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 8000;
require("express-async-errors");

app.use(express.json());

const { DataTypes, Sequelize } = require("sequelize");
const { stack } = require("sequelize/lib/utils");
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

sequelize.sync();

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
  res.status(201).send({
    error: false,
    result: data.dataValues,
  });
});
router.delete("/todo", async (req, res) => {
  const todoId = req.body.todoId;
  const data = Todo.destroy({ where: { id: todoId } })
    .then(() => console.log("succesfully deleted"))
    .catch(() => console.log("deletion error"));
  res.status(204).send({
    msg: "Succesfully deleted",
  });
});
router.put("/todo", async (req, res) => {
  const data = await Todo.update(req.body, { where: { id: req.params.id } });
  res.status(202).send({
    error: false,
    result: data,
    msg: data[0] ? "Update" : "Not update",
  });
});
app.use(router);

const errHandler = (err, req, res, next) => {
  const errStatusCode = 500;
  res.status(errStatusCode).send({
    error: true,
    msg: err.message,
    cause: err.cause,
    stack: err.stack,
  });
};

app.use(errHandler);

app.listen(PORT);

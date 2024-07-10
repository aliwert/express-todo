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
});

let { DataTypes, sequelize } = require("../lib")
const { Category } = require("./Category")
const { Product } = require("./Product")

const ProductCategory = sequelize.define(
  "ProductCategory",
  {},
  { timestamps: false }
)

module.exports = ProductCategory

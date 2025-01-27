let { DataTypes, sequelize } = require("../lib")

const ProductCategory = sequelize.define(
  "ProductCategory",
  {},
  { timestamps: false }
)

module.exports = ProductCategory

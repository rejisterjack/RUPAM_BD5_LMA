const express = require("express")
const { resolve } = require("path")
const { sequelize } = require("./lib")
const { Supplier } = require("./models/Supplier")
const { Product } = require("./models/Product")
const { Category } = require("./models/Category")

const app = express()
const port = 3000

app.use(express.json())
app.use(express.static("static"))

const suppliersData = [
  {
    name: "TechSupplies",
    contact: "John Doe",
    email: "contact@techsupplies.com",
    phone: "123-456-7890",
  },
  {
    name: "HomeGoods Co.",
    contact: "Jane Smith",
    email: "contact@homegoodsco.com",
    phone: "987-654-3210",
  },
]

const productsData = [
  {
    name: "Laptop",
    description: "High-performance laptop",
    quantityInStock: 50,
    price: 120099,
    supplierId: 1,
  },
  {
    name: "Coffee Maker",
    description: "12-cup coffee maker",
    quantityInStock: 20,
    price: 45000,
    supplierId: 2,
  },
]

const categoriesData = [
  { name: "Electronics", description: "Devices and gadgets" },
  {
    name: "Kitchen Appliances",
    description: "Essential home appliances for kitchen",
  },
]

app.get("/", (req, res) => {
  res.sendFile(resolve(__dirname, "pages/index.html"))
})

app.get("/seed_db", async (req, res) => {
  try {
    await sequelize.sync({ force: true })
    await Supplier.bulkCreate(suppliersData)
    await Product.bulkCreate(productsData)
    await Category.bulkCreate(categoriesData)
    res.status(200).send("Database seeded successfully")
  } catch (error) {
    console.error(error)
    res.status(500).send("An error occurred while seeding the database")
  }
})

// Exercise 1: Create a New Supplier
const addNewSupplier = async ({
  name = "",
  contact = "",
  email = "",
  phone = "",
}) => {
  const newSupplier = await Supplier.create({
    name,
    contact,
    email,
    phone,
  })
  return newSupplier
}

app.post("/suppliers/new", async (req, res) => {
  try {
    const newSupplierData = await addNewSupplier(req.body.newSupplier)
    res.status(200).json({
      newSupplier: newSupplierData,
    })
  } catch (error) {
    res.status(500).json({
      error: error.message,
    })
  }
})

// Exercise 2: Create a New Product
const addNewProduct = async ({
  name = "",
  description = "  ",
  quantityInStock = 0,
  price = 0,
  supplierId = 0,
}) => {
  const newProduct = await Product.create({
    name,
    description,
    quantityInStock,
    price,
    supplierId,
  })
  return newProduct
}

app.post("/products/new", async (req, res) => {
  try {
    const newProduct = await addNewProduct(req.body.newProduct)
    res.status(200).json({ newProduct })
  } catch (error) {
    res.status(500).json({
      error: error.message,
    })
  }
})

// Exercise 3: Create a New Category
const addNewCategory = async ({ name = "", description = "" }) => {
  const newCategory = await Category.create({
    name,
    description,
  })
  return newCategory
}
app.post("/categories/new", async (req, res) => {
  try {
    const newCategory = await addNewCategory(req.body.newCategory)
    res.status(200).json({ newCategory })
  } catch (error) {
    res.status(500).json({
      error: error.message,
    })
  }
})

// Exercise 4: Assign a Product to a Category
app.post(
  "/products/:productId/assignCategory/:categoryId",
  async (req, res) => {
    try {
    } catch (error) {
      res.status(500).json({
        error: error.message,
      })
    }
  }
)

// Exercise 5: Get All Products by Category
app.post("/categories/:id/products", async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({
      error: error.message,
    })
  }
})

// Exercise 6: Update a Supplier
app.post("/suppliers/:id/update", async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({
      error: error.message,
    })
  }
})

// Exercise 7: Delete a Supplier
app.post("/suppliers/delete", async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({
      error: error.message,
    })
  }
})

// Exercise 8: Get All Data with Associations
app.post("/supplier", async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({
      error: error.message,
    })
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

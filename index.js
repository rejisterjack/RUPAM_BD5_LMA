const express = require("express")
const { resolve } = require("path")
const { sequelize } = require("./lib")
const { Supplier } = require("./models/Supplier")
const { Product } = require("./models/Product")
const { Category } = require("./models/Category")
const ProductCategory = require("./models/ProductCategory")

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
const addNewSupplier = async ({ name, contact, email, phone }) => {
  const newSupplier = await Supplier.create({ name, contact, email, phone })
  return newSupplier
}

app.post("/suppliers/new", async (req, res) => {
  try {
    const newSupplierData = await addNewSupplier(req.body.newSupplier)
    res.status(200).json({ newSupplier: newSupplierData })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Exercise 2: Create a New Product
const addNewProduct = async ({
  name,
  description,
  quantityInStock,
  price,
  supplierId,
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
    res.status(500).json({ error: error.message })
  }
})

// Exercise 3: Create a New Category
const addNewCategory = async ({ name, description }) => {
  const newCategory = await Category.create({ name, description })
  return newCategory
}

app.post("/categories/new", async (req, res) => {
  try {
    const newCategory = await addNewCategory(req.body.newCategory)
    res.status(200).json({ newCategory })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Exercise 4: Assign a Product to a Category
const assignProductToCategory = async (productId, categoryId) => {
  const product = await Product.findByPk(productId, { include: [Category] })
  const category = await Category.findByPk(categoryId)

  if (!product || !category) {
    throw new Error("Product or category not found")
  }

  await product.addCategory(category)
  const updatedProduct = await Product.findByPk(productId, {
    include: [Category],
  })
  return updatedProduct
}

app.post(
  "/products/:productId/assignCategory/:categoryId",
  async (req, res) => {
    try {
      const updatedProduct = await assignProductToCategory(
        req.params.productId,
        req.params.categoryId
      )
      res.json({
        message: "Product assigned to category successfully",
        product: updatedProduct,
      })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }
)

// Exercise 5: Get All Products by Category
const getProductsByCategory = async (categoryId) => {
  const category = await Category.findByPk(categoryId, { include: [Product] })

  if (!category) {
    throw new Error("Category not found")
  }

  return category.Products
}

app.get("/categories/:id/products", async (req, res) => {
  try {
    const products = await getProductsByCategory(req.params.id)
    res.json({ products })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Exercise 6: Update a Supplier
const updateSupplier = async (supplierId, updateData) => {
  const supplier = await Supplier.findByPk(supplierId)

  if (!supplier) {
    throw new Error("Supplier not found")
  }

  await supplier.update(updateData)
  return supplier
}

app.post("/suppliers/:id/update", async (req, res) => {
  try {
    const updatedSupplier = await updateSupplier(
      req.params.id,
      req.body.updateSupplier
    )
    res.json({ updatedSupplier })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Exercise 7: Delete a Supplier
const deleteSupplier = async (supplierId) => {
  const supplier = await Supplier.findByPk(supplierId, { include: [Product] })

  if (!supplier) {
    throw new Error("Supplier not found")
  }

  await Product.destroy({ where: { supplierId } })
  await supplier.destroy()
}

app.post("/suppliers/delete", async (req, res) => {
  try {
    await deleteSupplier(req.body.supplierId)
    res.json({ message: "Supplier deleted successfully" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Exercise 8: Get All Data with Associations
const getAllDataWithAssociations = async () => {
  const suppliers = await Supplier.findAll({
    include: [
      {
        model: Product,
        include: [Category],
      },
    ],
  })

  return suppliers
}

app.get("/suppliers", async (req, res) => {
  try {
    const suppliers = await getAllDataWithAssociations()
    res.json({ suppliers })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

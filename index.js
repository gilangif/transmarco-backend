import express from "express"
import cors from "cors"

import errorHandler from "./middleware/errorHandler.js"
import boostProducts from "./utils/boostProduct.js"
import updateSheets from "./utils/updateSheets.js"
import checkOrders from "./utils/checkOrders.js"
import router from "./routes/router.js"

const app = express()
const port = 1234

updateSheets()
boostProducts()
checkOrders()

// app.use(cors())

app.use(express.json({ limit: "200mb" }))
app.use(express.urlencoded({ limit: "200mb", extended: true }))

app.use(router)
app.use(errorHandler)

app.listen(port, () => console.log(`# server listening on http://localhost:${port}`))

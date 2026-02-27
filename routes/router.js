import { authentication } from "../middleware/authentication.js"

import UserController from "../controllers/UserController.js"
import OtherController from "../controllers/OtherController.js"
import SheetController from "../controllers/SheetsController.js"
import ShopeeController from "../controllers/ShopeeController.js"

import express from "express"

const router = express.Router()

router.get("/", (req, res) => res.send("It's work !"))

router.get("/sheets/stocks", authentication, SheetController.getStock)
router.get("/sheets/stocks/now", authentication, SheetController.getStockNow)

router.post("/sheets/stocks/search", authentication, SheetController.searchStock)

router.get("/sheets/ecomm", authentication, SheetController.getEcomm)
router.post("/sheets/ecomm/add", authentication, SheetController.addEcomm)

router.post("/shopee/order/search", authentication, ShopeeController.searchOrder)
router.post("/shopee/order/detail", authentication, ShopeeController.getOrderDetail)

router.get("/shopee/boosts", authentication, ShopeeController.getBoosts)
router.get("/shopee/orders", authentication, ShopeeController.getOrders)
router.get("/shopee/orders/now", authentication, ShopeeController.getOrdersNow)

router.post("/shopee/product/detail", authentication, ShopeeController.getProductDetail)
router.post("/shopee/product/update", authentication, ShopeeController.updateStock)

router.post("/users/auth", UserController.auth)

router.post("/tools/photo", OtherController.getPhotoFromWebsite)
router.post("/photo/generator", OtherController.photoGenerator)

export default router

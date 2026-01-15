import { authentication } from "../middleware/authentication.js"

import UserController from "../controllers/UserController.js"
import OtherController from "../controllers/OtherController.js"
import SheetController from "../controllers/SheetsController.js"
import ShopeeController from "../controllers/ShopeeController.js"

import express from "express"

const router = express.Router()

router.post("/users/auth", UserController.auth)

router.get("/sheets", authentication, SheetController.getStock)

router.get("/shopee/boosts", authentication, ShopeeController.getBoosts)
router.get("/shopee/orders", authentication, ShopeeController.getOrders)
router.post("/shopee/detail", authentication, ShopeeController.getDetail)
router.post("/shopee/update", authentication, ShopeeController.updateStock)

router.post("/tools/photo", OtherController.getPhotoFromWebsite)

export default router

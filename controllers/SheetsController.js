import { config } from "./../config/index.js"

class SheetController {
  static async getStock(req, res, next) {
    try {
      res.json(config.sheets)
    } catch (error) {
      next(error)
    }
  }
}

export default SheetController

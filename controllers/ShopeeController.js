import { config } from "../config/index.js"

import Shopee from "../models/Shopee.js"
import fs from "fs"

class ShopeeController {
  static async getDetail(req, res, next) {
    try {
      const { product_id } = req.body

      if (!product_id) throw { status: 400, message: "product_id not provided" }

      const shopee = new Shopee()
      const detail = await shopee.getDetail(product_id)

      const model_list = detail.model_list
      const tier_variation = detail.tier_variation

      const variant_a = tier_variation[0] || []
      const variant_b = tier_variation[1] || []

      const options_a = variant_a.options || []
      const options_b = variant_b.options || []

      const images = variant_a.images || []

      const variants = options_a.map((option_a, i) => {
        const obj = { option: option_a, cover: images[i] || null }

        if (options_b.length > 0) {
          obj.fields = options_b.map((option_b) => {
            const model = model_list.find((model) => model.name === [option_a, option_b].join(","))

            const sku = model.sku || ""
            const art = model.sku.slice(0, 7)

            const arr = config.sheets.filter((x) => x.art === art)
            const inventory = arr.find((item) => (Object.hasOwn(item.inventory, sku) ? item.inventory[sku] : null))

            const artikel = arr.length > 0 ? arr[0].artikel : null
            const desc = arr.length > 0 ? arr[0].desc : null
            const price = arr.length > 0 ? arr[0].price : null
            const disc = arr.length > 0 ? arr[0].disc : null
            const promo = arr.length > 0 ? arr[0].promo : null
            const netto = arr.length > 0 ? arr[0].netto : null

            const stock = inventory ? inventory.inventory[sku] : 0

            return { option: option_b, model, artikel, desc, stock, price, disc, promo, netto }
          })
        }

        if (options_b.length === 0) {
          const model = model_list[0]

          const sku = model.sku
          const art = model.sku.slice(0, 7)

          const arr = config.sheets.filter((x) => x.art === art)
          const inventory = arr.find((item) => (Object.hasOwn(item.inventory, sku) ? item.inventory[sku] : 0))

          const artikel = arr.length > 0 ? arr[0].artikel : null
          const desc = arr.length > 0 ? arr[0].desc : null
          const price = arr.length > 0 ? arr[0].price : null
          const disc = arr.length > 0 ? arr[0].disc : null
          const promo = arr.length > 0 ? arr[0].promo : null
          const netto = arr.length > 0 ? arr[0].netto : null

          const stock = inventory ? inventory.inventory[sku] : 0

          const option = "-"

          obj.fields = [{ option, model, artikel, desc, stock, price, disc, promo, netto }]
        }

        return obj
      })

      const sheets = config.sheets.filter((x) => x.shopee_id == product_id)

      res.json({ ...detail, variants, sheets })
    } catch (error) {
      next(error)
    }
  }

  static async updateStock(req, res, next) {
    try {
      const { product_id, model_list } = req.body

      if (!product_id) throw { status: 400, message: "product_id not provided" }
      if (!model_list) throw { status: 400, message: "model_list not provided" }

      const shopee = new Shopee()
      const detail = await shopee.setStock(product_id, model_list)

      res.json(detail)
    } catch (error) {
      next(error)
    }
  }

  static async getBoosts(req, res, next) {
    try {
      const shopee = new Shopee()
      const boosts = await shopee.getBoosts()

      res.json(boosts)
    } catch (error) {
      next(error)
    }
  }

  static async getOrders(req, res, next) {
    try {
      const shopee = new Shopee()
      const orders = await shopee.getOrders("perlu_dikirim_perlu_diproses")

      res.json(orders)
    } catch (error) {
      next(error)
    }
  }
}

export default ShopeeController

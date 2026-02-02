import { config } from "../config/index.js"

import Shopee from "../models/Shopee.js"
import fs from "fs"

class ShopeeController {
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
      res.json(config.pesanan)
    } catch (error) {
      next(error)
    }
  }

  static async getOrdersNow(req, res, next) {
    try {
      const shopee = new Shopee()
      const orders = await shopee.getOrders("perlu_dikirim_perlu_diproses")

      res.json(orders)
    } catch (error) {
      next(error)
    }
  }

  static async getOrderDetail(req, res, next) {
    try {
      const { order_id } = req.body || {}

      if (!order_id) throw { status: 400, message: "order_id not provided" }

      const shopee = new Shopee()
      const order = await shopee.getOrderDetail(order_id)

      if (order.code) throw order

      res.json(order)
    } catch (error) {
      next(error)
    }
  }

  static async getProductDetail(req, res, next) {
    try {
      const { product_id } = req.body

      if (!product_id) throw { status: 400, message: "product_id not provided" }

      const shopee = new Shopee()
      const detail = await shopee.getProductDetail(product_id)

      const model_list = detail.model_list
      const tier_variation = detail.tier_variation

      const variant_a = tier_variation[0] || {}
      const variant_b = tier_variation[1] || {}

      const variants = []

      variant_a.options.forEach((a, i) => {
        const thumb = variant_a.images ? "https://down-id.img.susercontent.com/file/" + variant_a.images[i] : ""
        const option = a

        const res = { thumb, option, lists: [] }

        if (variant_b.options && variant_b.options.length > 0) {
          variant_b.options.forEach((b) => {
            const model = model_list.find((model) => model.name === [a, b].join(","))
            const name = b

            const sheets = config.stocks.find((stock) => stock.barcode === model.sku)

            const { desc = "", color = "", price = 0, promo = 0, netto = 0, stock = 0 } = sheets || {}

            const results = { name, model, desc, color, price, promo, netto, stock }

            res.lists.push(results)
          })
        } else {
          const name = a
          const model = model_list.find((model) => model.name === name)

          const sheets = config.stocks.find((stock) => stock.barcode === model.sku)

          const { desc = "", color = "", price = 0, promo = 0, netto = 0, stock = 0 } = sheets || {}

          const results = { name: name || "-", model, desc, color, price, promo, netto, stock }

          res.option = variant_a.name || name || "Variasi"
          res.lists.push(results)
        }

        variants.push(res)
      })

      const { id, name, images, parent_sku, description_info, brand_info, category_path_name_list, create_time } = detail
      const { description, description_type } = description_info || {}
      const { brand_name, brand_id } = brand_info

      const desc = description_type === "json" ? JSON.parse(description).field_list.map((x) => (x.type === 1 ? `https://down-id.img.susercontent.com/file/${x.value}` : x.value)) : [description]

      const brand = brand_name
      const category = category_path_name_list.join(" > ")
      const thumbs = images.map((x) => `https://down-id.img.susercontent.com/file/${x}`)

      const sheets = config.stocks.filter((x) => x.shopee_id === product_id)

      const results = { id, name, thumbs, parent_sku, desc, brand, category, create_time, variants, sheets }

      res.json(results)
    } catch (error) {
      next(error)
    }
  }

  static async searchOrder(req, res, next) {
    try {
      const { keyword, type } = req.body

      if (!keyword) throw { status: 400, message: "keyword is not provided" }

      const shopee = new Shopee()
      const search = await shopee.searchOrders(keyword, type)

      const { code, data, message, user_message } = search

      const {
        product_name_result,
        item_sku_result,
        model_sku_result,
        order_sn_result,
        buyer_user_name_result,
        booking_sn_result,
        shipping_trace_numbers_result,
        short_code_result,
        booking_shipping_trace_numbers_result,
        search_notice_info,
        combined_shipping_trace_numbers_result,
        combined_sn_result,
      } = data || {}

      const { total, list } = order_sn_result || {}

      if (code) throw search

      res.json(data)
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
      const update = await shopee.setStock(product_id, model_list)

      if (update.code) throw update

      res.json(update)
    } catch (error) {
      next(error)
    }
  }
}

export default ShopeeController

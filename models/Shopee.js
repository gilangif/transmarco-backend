import axios from "axios"
import fs from "fs"

import timestamp from "../utils/timestamp.js"

class Shopee {
  constructor() {
    this.product_location = { IDZ: "CITRUS BOTANI", ID014GWYZ: "CITRUS D-MALL" }

    this.file = "./cookies.json"

    this.SPC_CDS = "42fe6122-aa11-4a2a-a4e0-b7ae815564a2"
    this.SPC_CDS_VER = "2"

    this.cookies = JSON.parse(fs.readFileSync(this.file, { encoding: "utf-8" }))
      .cookies.filter((cookie) => cookie.value)
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ")

    this.params = { SPC_CDS: this.SPC_CDS, SPC_CDS_VER: this.SPC_CDS_VER }

    this.headers = {
      "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:146.0) Gecko/20100101 Firefox/146.0",
      "Accept-Language": "en-US,en;q=0.5",
      "Accept-Encoding": "gzip, deflate, br",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
      Host: "seller.shopee.co.id",
      Accept: "application/json, text/plain, */*",
      Locale: "id",
      Te: "trailers",
      Cookie: `SPC_CDS=${this.SPC_CDS}; ${this.cookies}`,
    }
  }

  async getBoosts() {
    const { params, headers } = this

    const { data: result } = await axios.get("https://seller.shopee.co.id/api/v3/opt/mpsku/list/get_bumped_product_list", { params, headers })
    const { code, message, user_message, data } = result || {}
    const { config, products } = data || {}

    if (result.code) throw result
    if (!products) return []

    const arr = products.map(async (x) => {
      try {
        const { id, cool_down_seconds } = x

        const now = new Date()
        const date = new Date(now.getTime() + cool_down_seconds * 1000)
        const estimate = timestamp(date)

        const detail = await this.getProductDetail(id)

        const name = detail.name
        const boost_id = String(id) + "_" + timestamp(date).toUpperCase().replace(",", "").split(" ").join("_")

        return { ...x, date, estimate, name, detail, boost_id }
      } catch (error) {
        return null
      }
    })

    const results = await Promise.all(arr)

    return results.filter((x) => x)
  }

  async getOrders(type, page) {
    const { SPC_CDS, SPC_CDS_VER, headers, product_id, product_location } = this

    const config = { params: { SPC_CDS, SPC_CDS_VER }, headers }

    let order_list_tab = 100

    let category = {
      perlu_dikirim_perlu_diproses: "package_param_list",
      perlu_dikirim_telah_diproses: "package_param_list",
      perlu_dikirim_semua: "package_param_list",
      belum_bayar: "order_param_list",
      dikirim: "order_param_list",
      selesai: "order_param_list",
      semua: "order_param_list",
    }

    if (type === "semua") order_list_tab = 300
    if (type === "belum_bayar") order_list_tab = 200

    if (type === "perlu_dikirim_semua") order_list_tab = 300
    if (type === "perlu_dikirim_perlu_diproses") order_list_tab = 300
    if (type === "perlu_dikirim_telah_diproses") order_list_tab = 300

    if (type === "dikirim") order_list_tab = 400
    if (type === "selesai") order_list_tab = 500

    const data = {
      order_list_tab,
      entity_type: 1,
      pagination: { from_page_number: 1, page_number: 1, page_size: 200 },
      // pagination: { from_page_number: 2, page_number: 3, page_size: 40, page_sentinel: '1766654888,220354027232785' },
      filter: { fulfillment_type: 0, is_drop_off: 0, action_filter: 0, fulfillment_source: 0 },
      sort: {},
    }

    if (type === "semua") {
      data.entity_type = 0
      data.sort.sort_type = 3
      data.sort.ascending = false
    }

    if (type === "perlu_dikirim_semua") {
      data.entity_type = 1
      data.filter.order_to_ship_status = 0
      data.sort.sort_type = 1
      data.sort.ascending = true
    }

    if (type === "perlu_dikirim_perlu_diproses") {
      data.entity_type = 0
      data.filter.order_to_ship_status = 1
      data.sort.sort_type = 1
      data.sort.ascending = true
    }

    if (type === "perlu_dikirim_telah_diproses") {
      data.entity_type = 0
      data.filter.order_to_ship_status = 2
      data.sort.sort_type = 1
      data.sort.ascending = true
    }

    if (type === "dikirim") data.entity_type = 1
    if (type === "selesai") data.entity_type = 1
    if (type === "belum_bayar") data.entity_type = 1

    const { data: lists } = await axios.post("https://seller.shopee.co.id/api/v3/order/search_order_list_index", data, config)
    const { index_list, pagination, search_notice_info } = lists.data || {}

    if (lists.code) throw lists

    const arr = Array.from({ length: Math.ceil(index_list.length / 5) + 1 }, async (x, i) => {
      try {
        const data = { order_list_tab, need_count_down_desc: true }

        data[category[type]] = index_list.slice(i * 5, i * 5 + 5)

        const { data: orders } = await axios.post("https://seller.shopee.co.id/api/v3/order/get_order_list_card_list", data, config)

        return orders.data.card_list.map((x) => x.package_card || x.order_card)
      } catch (error) {
        return []
      }
    })

    const orders = (await Promise.all(arr)).flat().filter((x) => x)

    return orders
  }

  async getOrderDetail(order_id) {
    const { params, headers } = this
    const { data } = await axios.get("https://seller.shopee.co.id/api/v3/order/get_one_order", { params: { ...params, order_id }, headers })

    return data
  }

  async getProductDetail(product_id) {
    const { SPC_CDS, SPC_CDS_VER, headers, product_location } = this
    const { data } = await axios.get("https://seller.shopee.co.id/api/v3/product/get_product_info", { params: { SPC_CDS, SPC_CDS_VER, product_id, is_draft: "false" }, headers })

    if (data.code) throw data

    // fs.writeFileSync("detail.json",  JSON.stringify(data, null, 2))

    // const data = JSON.parse(fs.readFileSync("detail.json", { encoding: "utf-8" }))

    const product = data.data.product_info

    const product_models = product.model_list

    const model_list = product_models.map((model) => {
      const stock_detail = model.stock_detail
      const seller_stock_info = stock_detail.seller_stock_info.map((stock) => ({ ...stock, location_name: product_location[stock.location_id] }))

      return { ...model, stock_detail: { ...model.stock_detail, seller_stock_info } }
    })

    return { ...product, model_list }
  }

  async getProduct(keyword = "", cursor = "") {
    try {
      const { SPC_CDS, SPC_CDS_VER, headers, product_id, product_location } = this

      const url = `https://seller.shopee.co.id/api/v3/opt/mpsku/list/v2/search_product_list?SPC_CDS=${SPC_CDS}&SPC_CDS_VER=${SPC_CDS_VER}&cursor=${cursor}&page_size=12&list_type=live_all&keyword=${keyword}&request_attribute=&operation_sort_by=recommend_v4&=true&need_ads=true`

      const { data } = await axios.get(url, { headers })

      if (data.code) throw data

      return data.data
    } catch (error) {
      console.log({ error, source: "Shopee searchProduct" })
      return { error, failed: true }
    }
  }

  async getPromo(promotion_id) {
    try {
      const data = { promotion_id: parseInt(promotion_id), offset: 0, limit: 200 }

      const { data: result } = await axios.post("https://seller.shopee.co.id/api/marketing/v4/discount/get_discount_items_aggregated/", data, { params: this.params, headers: this.headers })
      if (result.code) throw result

      return result.data
    } catch (error) {
      return { error, failed: true }
    }
  }

  async getBundlePromo(bundle_deal_id) {
    try {
      const params = { ...this.params, bundle_deal_id }

      const { data } = await axios.get("https://seller.shopee.co.id/api/marketing/v3/bundle_deal/", { params, headers: this.headers })
      if (data.code) throw data

      const result = data.data

      const { start_time, end_time } = result

      const now = new Date()

      const start = new Date(start_time * 1000)
      const end = new Date(end_time * 1000)

      const start_timestamp = timestamp(start)
      const end_timestamp = timestamp(end)

      const status = now < start ? "AKAN BERJALAN" : now < end ? "SEDANG BERJALAN" : "TELAH BERAKHIR"

      return { ...result, start_timestamp, end_timestamp, status }
    } catch (error) {
      return { error, failed: true }
    }
  }

  async searchPromo(keyword = "") {
    try {
      const data = { discount_type: 0, time_status: 0, keyword, search_type: 0 }

      const { data: result } = await axios.post("https://seller.shopee.co.id/api/marketing/v3/public/discount/search/", data, { params: this.params, headers: this.headers })
      if (result.code) throw result

      const { discounts, total_count } = result.data || {}

      const now = new Date()

      const obj = {
        ...result.data,
        discounts: discounts.map((x) => {
          const disc = x.bundle_deal != null ? x.bundle_deal : x.seller_discount != null ? x.seller_discount : {}

          const { discount_type, seller_discount, add_on_deal, bundle_deal } = x
          const { discount_id, name, time_status, start_time, end_time, item_preview, source, global_discount_id, enable_direct_shop_promo_sync } = disc

          const start = new Date(start_time * 1000)
          const end = new Date(end_time * 1000)

          const start_timestamp = timestamp(start)
          const end_timestamp = timestamp(end)

          const type = x.bundle_deal && x.bundle_deal.discount_id ? "BUNDLE" : x.seller_discount && x.seller_discount.discount_id ? "DISCOUNT" : "UNKNOWN"
          const type_key = x.bundle_deal && x.bundle_deal.discount_id ? "bundle_deal" : x.seller_discount && x.seller_discount.discount_id ? "seller_discount" : ""

          const status = now < start ? "AKAN BERJALAN" : now < end ? "SEDANG BERJALAN" : "TELAH BERAKHIR"

          return { ...x, start_timestamp, end_timestamp, status, type, type_key }
        }),
      }
      return obj
    } catch (error) {
      return { error, failed: true }
    }
  }

  async setStock(product_id, model_list) {
    const { SPC_CDS, SPC_CDS_VER, headers } = this

    const obj = { product_id: parseInt(product_id), product_info: { model_list }, is_draft: false }

    const { data } = await axios.post("https://seller.shopee.co.id/api/v3/product/update_product_info", obj, { params: { SPC_CDS, SPC_CDS_VER }, headers })

    return data
  }

  async setBoost(id) {
    try {
      const { data } = await axios.post("https://seller.shopee.co.id/api/v3/opt/product/boost_product/", { id }, { params: { ...this.params, version: "3.1.0" }, headers: this.headers })
      const { code, message, user_message, transify_key } = data

      if (data.code) throw data

      return { ...data, id }
    } catch (error) {
      return { error, failed: true }
    }
  }

  async searchOrders(keyword = "", type) {
    const { params: prms, headers } = this

    let category = "1"

    if (type === "no_pesanan") category = "1"
    if (type === "nama_pembeli") category = "2"
    if (type === "no_resi") category = "3"
    if (type === "produk") category = "4"

    const params = { ...prms, keyword, category, order_list_tab: "100", entity_type: "1", fulfillment_source: "0" }

    const { data } = await axios.get("https://seller.shopee.co.id/api/v3/order/get_order_list_search_bar_hint", { params, headers })

    return data
  }
}

export default Shopee

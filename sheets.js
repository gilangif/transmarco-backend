import { Telegraf } from "telegraf"
import { google } from "googleapis"
import { exec } from "child_process"

import * as cheerio from "cheerio"

import express from "express"
import JSZip from "jszip"
import axios from "axios"
import fs from "fs"
import os from "os"

const app = express()
const port = 6969

const bots = [
  new Telegraf("8519274635:AAGD_IDTVUAUTcR0zpcw6a94c6jGd2Kod8U"), // Pak Budi
  new Telegraf("8148178449:AAHsz30AmW5oQ1yMtNIENatsUWougoS9sN8"), // Pak Win
  new Telegraf("8564008355:AAF1Gpvy-4ZR46SZeLpdRZJTzb7knVI4K94"), // SPG
  new Telegraf("7606023980:AAFySp07z1H5wyR0PRh1fSta-0b8eA4lJTQ"), // SPB
]

const config = { stocks: [], messageid: [], pesanan: {}, boosts: {}, botindex: 0, group: "-1003576780077", host: "127.0.0.1" }

class Sheets {
  constructor(spreadsheetId, brand) {
    this.spreadsheetId = spreadsheetId

    this.HPAL = new google.auth.GoogleAuth({
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      credentials: {
        type: "service_account",
        project_id: "studious-karma-439813-n7",
        private_key_id: "503c69d9802bb5e93b1948b26a575ce310759cb4",
        private_key:
          "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCyAAd4vzpPGsAr\npR1QkWaUi/ZQ3oWlARdkFtZCP3U5RbTqWTPABB/U5n8RZ90n6Ksl8YpqjKB6J+4s\nyjrntEG4NppdYFKFUC2ny+UvyrDdVdAdSGDj89q4g1dRZ034oPOCfIWfou+iJW18\nvsZzXe4flFw4+qZu+CjBrWSLURDypu8VndGTptA95lo4kvkXWtd/8JxlMHVzh2bY\nvlvNvZapM0Nq1/1szL98IU7sl8ooCJlpXtcYA0i8BTsC/q6wq+MJnopfTxLzGv0V\n1i8PYpw9gBU0wbUzLmoiPedfcma2YeV1xhr2ua4Z+GUEgT2jACuhDyhwUnFgDlvN\nDS0Uh2LjAgMBAAECggEADfhJndToRyAS1/oP+GxI8Dyh2sv0EjSpOM5AB5gCY7nQ\nTposoRPRybxDWcLcjQ7KK+KumdkqmRu8KiC/CcNQaxxB9jUilNrrkmFCvgL66Ywc\nFshA7nMLhfKs7jMc3/gF1IZgWFyJ0SB93M3+Njy3fRwANuqZGFl6nWS14Oc+XMTS\nudfCGs9hd1+zDxyZo7nynn6IRQJyDeRhCQ2Jj8ZZJ4hRI8qyWckn0iY9VzQLw1k4\nDIZNmEnXxO8N3CEK88bYzdLM41Wdml9AT3b41zR4/I5nt7ZtAnzwQB0S5tneViqK\nlr27X1pUbjmgdDq1xQKgDmbpyafUYuZs1WvGj/Rc+QKBgQDWjmFiVnTwCm+9wNqd\nfIbxquzAvnTdvjj79FvzHJ1azTB0/rc+nGupYbDk2GJAC2+5FFZY3Gw+5lMj3WVJ\naehI5TDo2v3/Q3dl3OXx25+cRsSUf/MX1kaX7s73fPwy2d338AjJX9GVpPQCJYRN\nmtZH8TlHIIJWBrgu+dzwieLTaQKBgQDUYfucFG7B7WBw+gn+3Tf4n61kRarkHZse\nfwVhVcZTNU10gTB9sFN38GEPcqGlHjc0aLmmJR8JTGJ9t4jEkrNZAfsrs2zgnv9o\n/6/k5g1/k54mF19dPI5+geguBzRe0AD9tYEW55OFAZG0IVmpfqALNEEUIAbBAI21\nYYE3NF4WawKBgGYNKvzfKpfSHvwect1dkcH5DstOy7987xXIUMP95EqANoAvd3Fs\nbTkPolf3JCRaTDW4GqoBjesNGpaAg+C7YyTo/q6DGzUDHhNxUl4LnIt0jaQkh7fa\nz5EMoZzN8hct0YpQvZ0q2kFXSEiNF7Th5PIrJpdSOyw33ftaFWDD9QOhAoGAMDvg\njN4HGXvzvzTKOFu9bnW1R2SbHxuqMw7eBfEZDaS5ZpBAlwsIqeCp6nw6QenO19RA\n9X7QwafbZnncUeiPWtOcW5xwScNSdmI7bFzjC+pWrIf6XI54Pjr6pBl2x2GuF/C0\n1KLbWgW1NZetaVUcu+6uKQftAMBDbsIqOoNmKukCgYB0KkOCe/4mJ+DujHthxCpS\nKOgYbzmdsOzlasLmLwFFh2jG2odmU7SJytrq818nDjUS+JAAc+G3UX44l2WvTnqV\nvH9qKmOPQWrYS2r24+82oWeQV+dOOkhtibEgw6sUTG4BqFytqRhKAYjtZJdKXgsV\nwI/QA5uTS3Ig8PpiEScdGA==\n-----END PRIVATE KEY-----\n",
        client_email: "transmarco@studious-karma-439813-n7.iam.gserviceaccount.com",
        client_id: "113308231215563709252",
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/transmarco%40studious-karma-439813-n7.iam.gserviceaccount.com",
        universe_domain: "googleapis.com",
      },
    })

    this.HPAM = new google.auth.GoogleAuth({
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      credentials: {
        type: "service_account",
        project_id: "transmarco-482613",
        private_key_id: "a4bb8dd792bd70b5089ac0e7f1407ecc37d33754",
        private_key:
          "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCfV1pU3aanTswO\ng0DODa04rSj95eOsx/Xay/XcmdTOWbG2lsEH0wmuBZ4YOgn5thdGw/pDF/QZ3Vcv\nHMAk0n/dakE5ejZNfrGmaAsWxvy0yeD9kwCvQ5HLPGKe0fJmtqBc40MhT9TuF477\n6BCt9kzb//araKnX5wWnvo1gizGY6TuMSuYsM4nM5nud/daybcuzvyvkEQvLNDTO\nzEcdPBUwGw4aEkOw+EKsNd5vjOCs/0gUp3vXGF51v4BMRLe6+bLoxggZzPZckKfy\n2mJV1WpU7K3iHVmVmpAP1pV0o8AxBzG4ZcC+houIL8HovSQuWK6JFfGcjdlplrz6\nKBqy5x9lAgMBAAECggEABlV1e965sEUQe6bNAMPVAsxwG80zffVCErOKPBdWhbaI\n1JsgF8lt3sYbZDDxn5FhuHuznk7v8mB0uQszOhauykreExGGe6seSnqW4kEAeS4P\n+WE9pQar33PKVpZxRJL2EFGT8NmL1Pdu+BisvQ8hPAEfOYepPktRIFT4D4JI81NW\nBnls8gwCFIAv2DWwZAv284xI4jBMGMZkH8TqPKM6o+gFZlMM5ZSY4Vo+VCKwOjx6\n7KMc4F1ItNEt2eLjTygSnwvgMQ/dlxnuWeqw6vg2ZypS3y5YXbxbUkP6d+WIW1VS\n4j6u/ZNAMSO8kXeUFMP8J6jUC6YubgWI8/sZHBIHMQKBgQDQPmy6tw7qX/aBDyl1\n7YSf9KrMtZo24QSQK3wFhnisAu9csFeGARnlMsOETdpo8XAesdutZW6TXDbB3DA5\nu7Xhl88A5sO1Hv7z217vjvmFr+jlEg2NApEcjhiFOXdWFsTxyxBLFyiko8qkjbWA\n7+92K+m1Iz5+2rjnd1sBgy0zOQKBgQDD4fQzHY0C0tNjTY5hj8gBXyVjjBi4mzVr\n4b1klkuD6XKX5eCXjkBfWLD9jf9bWac9y23XKaVdQ731pgug93ROPlVfSypTtV3V\nAc9OudDSKZOlcgHKisUwJrTNm3yTrvYFXKpt2vQwBlWO1gS5Y6X80YtZn2Lw1xj5\ng9uBadQxjQKBgCCGX30aMl4w9tNZhuRAYMKK+FJY2ulPY+MQp6JFSnuzSad0c3ce\nnOjLcPYtIrvZWeWxado/SXICqRrGRVH/G31MtKwzXsXfPXrg/Ib2EcrrmriMhUlM\n6VVIbFQCkb0EeWY6jSTtTQ/J9VCWQY8N6pzOZwY/pvcxOkgMwE4QKvMhAoGBAIh8\ny+xF/fhmsHZ0Fu6yAdm601GOz7bqJwoZzB7nfozWwEtJGPphW0dUhFbYd4LOcHLl\naY7P7PKUfitJXLb3VaojUtdIh6C2MkB2t12SqgeWgtN4IflgQk/v2HGfkulQswo/\nbF2JgDZqY3lYdQg8f+8ujxuOrKFGL5fEodGFzR4NAoGAUA00NZ+651xb1Mcqr7ee\nFMvFIlYuQEKzTn9Lyv30cNVSvmrACr4ugotCo9WnwAcyalyZqleJ035CGR4Rl9Gg\nZN6tKB88+4VEtkS49jLMHuveMTxtf+qg9Wc9W11HwXhBdpUEk6N7A9yftjzty9Kw\nmd0n/ymojjWg5UsfO/qjWCg=\n-----END PRIVATE KEY-----\n",
        client_email: "transmarco-831@transmarco-482613.iam.gserviceaccount.com",
        client_id: "105534025070186600808",
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/transmarco-831%40transmarco-482613.iam.gserviceaccount.com",
        universe_domain: "googleapis.com",
      },
    })

    this.brand = brand
    this.auth = this[brand]

    this.sheets = google.sheets({ version: "v4", auth: this.auth })
  }

  async get(range) {
    const res = await this.sheets.spreadsheets.values.get({ spreadsheetId: this.spreadsheetId, range, majorDimension: "ROWS" })
    return res.data
  }

  async getStock() {
    try {
      const res = await this.sheets.spreadsheets.values.get({ spreadsheetId: this.spreadsheetId, range: "STOCK!A1:CE500", majorDimension: "ROWS" })
      const data = res.data.values

      let keys = []

      const HPAL = [
        "artikel",
        "desc",
        "inventory",
        "inventory",
        "inventory",
        "inventory",
        "inventory",
        "inventory",
        "inventory",
        "inventory",
        "inventory",
        "inventory",
        "sales",
        "sales",
        "sales",
        "sales",
        "sales",
        "sales",
        "sales",
        "sales",
        "sales",
        "sales",
        "in",
        "in",
        "in",
        "in",
        "in",
        "in",
        "in",
        "in",
        "in",
        "in",
        "out",
        "out",
        "out",
        "out",
        "out",
        "out",
        "out",
        "out",
        "out",
        "out",
        "ecomm",
        "ecomm",
        "ecomm",
        "ecomm",
        "ecomm",
        "ecomm",
        "ecomm",
        "ecomm",
        "ecomm",
        "ecomm",
        "stock",
        "stock",
        "stock",
        "stock",
        "stock",
        "stock",
        "stock",
        "stock",
        "stock",
        "stock",
        "reffcode",
        "shopee_id",
        "sku_qty",
        "code",
        "sku",
        "price",
        "disc",
        "netto",
        "promo",
      ]

      const HPAM = [
        "artikel",
        "desc",
        "inventory",
        "inventory",
        "inventory",
        "inventory",
        "inventory",
        "inventory",
        "inventory",
        "inventory",
        "inventory",
        "inventory",
        "inventory",
        "inventory",
        "sales",
        "sales",
        "sales",
        "sales",
        "sales",
        "sales",
        "sales",
        "sales",
        "sales",
        "sales",
        "sales",
        "sales",
        "in",
        "in",
        "in",
        "in",
        "in",
        "in",
        "in",
        "in",
        "in",
        "in",
        "in",
        "in",
        "out",
        "out",
        "out",
        "out",
        "out",
        "out",
        "out",
        "out",
        "out",
        "out",
        "out",
        "out",
        "ecomm",
        "ecomm",
        "ecomm",
        "ecomm",
        "ecomm",
        "ecomm",
        "ecomm",
        "ecomm",
        "ecomm",
        "ecomm",
        "ecomm",
        "ecomm",
        "stock",
        "stock",
        "stock",
        "stock",
        "stock",
        "stock",
        "stock",
        "stock",
        "stock",
        "stock",
        "stock",
        "stock",
        "reffcode",
        "shopee_id",
        "sku_qty",
        "code",
        "sku",
        "price",
        "disc",
        "netto",
        "promo",
      ]

      if (this.brand === "HPAL") keys = HPAL
      if (this.brand === "HPAM") keys = HPAM

      const brand = this.brand
      const fields = brand === "HPAL" ? ["S", "M", "L", "XL", "XXL", "26", "28", "30", "32", "TOTAL"] : ["S", "M", "L", "XL", "XXL", "XXXL", "30", "32", "34", "36", "38", "TOTAL"]
      const size = ["inventory", "sales", "in", "out", "ecomm", "stock"]

      const stocks = data
        .slice(2)
        .filter((x) => x)
        .map((line, lineidx) => {
          const temp = { inventory: {}, obj: {} }

          const artikel = line[0].slice(0, 7)

          line.forEach((column, columnidx) => {
            const key = keys[columnidx]

            const num = ["sku_qty", "price", "netto"].find((x) => x === key)
            const stock = size.find((x) => x === key)

            if (stock) {
              const value = parseInt(column || 0) || 0

              if (!temp.inventory[stock]) {
                temp.inventory[stock] = []
              }

              temp.inventory[stock].push(value)
            } else {
              const val = column.split(".").join("") || 0
              const value = num ? parseInt(val) : column

              temp.obj[key] = value
            }
          })

          return { ...temp.obj, ...temp.inventory, art: artikel, fields, brand }
        })

      return stocks.filter((x) => x)
    } catch (error) {
      console.log({ error, message: "sheets getStock" })
      return []
    }
  }

  async append() {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Sheet1!A:B",
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [["6", "g"]],
      },
    })
  }
}

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
      Host: "seller.shopee.co.id",
      "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:146.0) Gecko/20100101 Firefox/146.0",
      Accept: "application/json, text/plain, */*",
      "Accept-Language": "en-US,en;q=0.5",
      "Accept-Encoding": "gzip, deflate, br",
      Locale: "id",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
      Te: "trailers",
      Cookie: `SPC_CDS=${this.SPC_CDS}; ${this.cookies}`,
    }
  }

  async getBoosts() {
    try {
      const { data: result } = await axios.get("https://seller.shopee.co.id/api/v3/opt/mpsku/list/get_bumped_product_list", { params: this.params, headers: this.headers })
      const { code, message, user_message, data } = result || {}
      const { config, products } = data || {}

      if (result.code) throw result

      if (!products) return []

      const arr = products.map(async (x) => {
        const { id, cool_down_seconds } = x

        const now = new Date()
        const date = new Date(now.getTime() + cool_down_seconds * 1000)
        const estimate = timestamp(date)

        const detail = await this.getDetail(id)
        if (detail.failed) return null

        const name = detail.name
        const boostid = String(id) + "_" + timestamp(date).toUpperCase().replace(",", "").split(" ").join("_")

        return { ...x, date, estimate, name, detail, boostid }
      })

      const results = await Promise.all(arr)

      return results
    } catch (error) {
      return { error, failed: true }
    }
  }

  async getOrders(type, page) {
    try {
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
    } catch (error) {
      console.log({ error, source: "Shopee getOrders" })
      return { error, failed: true }
    }
  }

  async getDetail(product_id) {
    try {
      const { SPC_CDS, SPC_CDS_VER, headers, product_location } = this
      const { data } = await axios.get("https://seller.shopee.co.id/api/v3/product/get_product_info", { params: { SPC_CDS, SPC_CDS_VER, product_id, is_draft: "false" }, headers })

      if (data.code) throw data

      const product = data.data.product_info

      const product_models = product.model_list

      const model_list = product_models.map((model, model_idx) => {
        const stock_detail = model.stock_detail
        const seller_stock_info = stock_detail.seller_stock_info.map((stock) => ({ ...stock, location_name: product_location[stock.location_id] }))

        const arr = model.name.split(",").map((variant, variant_idx) => [variant_idx === 0 ? "color" : "size", variant_idx === 0 ? variant.split(" (")[0] : variant])
        const obj = Object.fromEntries(arr)

        const variation = { color: "", size: "", ...obj }

        return { ...model, variation, stock_detail: { ...model.stock_detail, seller_stock_info } }
      })

      return { ...product, model_list }
    } catch (error) {
      return { error, failed: true }
    }
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
    try {
      const { SPC_CDS, SPC_CDS_VER, headers, product_location } = this

      const data = { product_id: parseInt(product_id), product_info: { model_list }, is_draft: false }
      const { data: result } = await axios.post("https://seller.shopee.co.id/api/v3/product/update_product_info", data, { params: { SPC_CDS, SPC_CDS_VER }, headers })

      if (result.code) throw result

      return result
    } catch (error) {
      console.log({ error, source: "Shopee getStock" })
      return { error, failed: true }
    }
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
}

class Photo {
  constructor(target) {
    this.target = target
    this.type = target.includes("hushpuppies.co.id") ? "HUSHPUPPIES" : target.includes("9to9.co.id") ? "9TO9" : target.includes("zalora.co.id") ? "ZALORA" : "UNKNNOWN"
  }

  async generate() {
    const merchant = this.type
    const arr = []

    try {
      const response = await axios.get(this.target)
      const $ = cheerio.load(response.data)

      if (merchant === "HUSHPUPPIES") {
        const items = $("li.media-thumbs__item button img")
        const title = $("h1.product-title")?.text().trim()
        const variant = ""
        const desc = $("div.product-spec__value")?.text().trim()

        items.each((i, el) => {
          const url = "https://hushpuppies.co.id" + $(el).attr("src")?.split("hushpuppies.co.id")[1]?.split("?v=")[0]
          const file = url.split("files/")[1]

          arr.push({ title, url, file, variant, desc })
        })
      }

      if (merchant === "ZALORA") {
        const items = $("div.relative.shrink-0.basis-full.snap-center.snap-always img")
        const title = $('[data-test-id="productName"]')?.text().trim()
        const variant = $("span.truncate.text-sm.font-normal.leading-5.text-neutral-500")?.text().trim()
        const desc = "NO DESCRIPTION"

        items.each(async (i, el) => {
          const link = $(el).attr("src")
          const urls = link.split("format(webp)/")
          const url = urls.length > 1 ? urls[1] : link
          const file = `${title.replace(/\s+/g, "-")}_${variant.replace(/\s+/g, "-")}_${i + 1}.jpg`

          arr.push({ title, url, file, variant, desc })
        })
      }

      if (merchant === "9TO9") {
        const items = $("li.swiper-slide.media-thumbs__item button img")
        const title = $("h1.product-title")?.text().trim()
        const variant = $("span.truncate.text-sm.font-normal.leading-5.text-neutral-500")?.text().trim()
        const desc = $("div.product-spec__value")?.text().trim()

        items.each(async (i, el) => {
          const url = "https://9to9.co.id" + $(el).attr("src")?.split("9to9.co.id")[1]?.split("?v=")[0]
          const file = `${title.replace(/\s+/g, "-")}_${variant.replace(/\s+/g, "-")}_${i + 1}.jpg`

          arr.push({ title, url, file, variant, desc })
        })
      }
    } catch (error) {
      console.log("\x1b[31m")
      console.log(`# Failed fetch HTML data`)
      console.log(`  ${this.target}`)
      console.log("\x1b[0m")
    }

    return Array.from(new Map(arr.map((item) => [item.url, item])).values()).map((x) => ({ ...x, merchant }))
  }

  async search(query) {
    const merchant = this.type

    if (merchant === "ZALORA") {
      try {
        const { data: results } = await axios.get("https://api.zalora.co.id/v1/dynproducts/datajet/list", {
          params: { enableRelevanceClassifier: "true", fullFacetCategory: "true", limit: "30", offset: "0", query, shop: "m" },
          headers: {
            Accept: "application/json",
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:146.0) Gecko/20100101 Firefox/146.0",
            "Accept-Language": "en-US,en;q=0.5",
            "Accept-Encoding": "gzip, deflate, br",
            "Content-Language": "id-ID",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-site",
          },
        })

        const { data } = results || {}
        const { NumProductFound, Products = [] } = data || {}

        return Products.map((x) => "https://www.zalora.co.id/" + x.ProductUrl)
      } catch (error) {
        return []
      }
    }

    if (merchant === "HUSHPUPPIES" || merchant === "9TO9") {
      try {
        const response = await axios(this.target, { timeout: 5000 })
        const $ = cheerio.load(response.data)

        const target = {
          HUSHPUPPIES: { domain: "https://hushpuppies.co.id", selector: "div.card__media.has-hover-image > a" },
          "9TO9": { domain: "https://9to9.co.id", selector: "div.card__media.has-hover-image > a" },
        }

        const results = $(target[merchant].selector) || []

        const search = Array.from(results)
          .map((x) => $(x).attr("href"))
          .filter((x) => x && x.includes("products"))
          .map((x) => `${target[merchant].domain}${x}`)

        return search
      } catch (error) {
        return []
      }
    }

    return []
  }

  async downloader(arr) {
    const lists = arr.map(async (x, i) => {
      const { title, url, file, variant, desc, merchant } = x

      const filename = url
      const caption = `# ${i + 1} ${title} ${variant}\n# ${merchant}\n\n${url}`
      const type = "photo"

      const media = { source: null, filename }

      try {
        const { data } = await axios({ url, method: "GET", responseType: "arraybuffer" })
        media.source = data
      } catch (error) {
        console.log("\x1b[31m")
        console.log(`# Failed download ${filename}`)
        console.log("\x1b[0m")
      }

      return { ...x, type, caption, media }
    })

    return (await Promise.all(lists)).filter((x) => x.media.source)
  }
}

const currency = (number) => new Intl.NumberFormat("id-ID", { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(number)

const timestamp = (time, type) => {
  const a = { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true }
  const b = { weekday: "long", day: "2-digit", month: "long", year: "numeric" }
  const c = { weekday: "long", day: "2-digit", month: "long", year: "numeric", ...a }

  const date = time ? (isNaN(new Date(time).getTime()) ? new Date() : new Date(time)) : new Date()
  const opt = type === "time" ? a : type === "date" ? b : c

  return new Intl.DateTimeFormat("id-ID", opt).format(date).replace("pukul ", "").replace(/\./g, ":")
}

const textSpliter = (str) => {
  const lines = str.split("\n")
  const chunks = []

  let curr = ""

  for (const line of lines) {
    const nextLength = curr.length + line.length + 1

    if (nextLength <= 4096) {
      curr += (curr ? "\n" : "") + line
    } else {
      chunks.push(curr)
      curr = line
    }
  }

  if (curr) chunks.push(curr)

  return chunks
}

const stringStock = (arr, type = "stock") => {
  let result = arr[0]

  let title =
    type === "stock"
      ? "STOCK AKHIR"
      : type === "sales"
      ? "PENJUALAN"
      : type === "in"
      ? "DATANG BARANG"
      : type === "out"
      ? "RETUR BARANG"
      : type === "ecomm"
      ? "E-COMMERCE"
      : type === "inventory"
      ? "STOCK AWAL"
      : "UNKNOWN TYPE"

  let str = `# ${result.desc}\n# ${result.art} (${Array.from(new Set(arr.map((x) => x.sku))).join(", ")})\n\n# ${title}:\n\n`
  let total = arr
    .map((x) => x[type].map((y) => y))
    .flat()
    .reduce((a, b) => a + b, 0)

  arr
    .filter((x) => x[type])
    .forEach((x) => {
      const stock = x[type]
      const data = stock.map((qty, qtyidx) => `${qtyidx === stock.length - 1 ? "\n" : ""}${x.sku} ${x.fields[qtyidx]} `.padEnd(10, "=") + ` ${qty} pcs${qtyidx === stock.length - 1 ? "\n" : ""}`)

      str += data.join("\n")
      str += "\n"
    })

  str += `# TOTAL ALL SKU ${total} pcs\n\n`
  str += `# PROMO ${result.promo}\n`
  str += `# GROSS PRICE Rp.${currency(result.price)}\n`
  str += `# NETTO PRICE Rp.${currency(result.netto)}\n`

  return { result, str }
}

const searchStock = async (text) => {
  try {
    const stocks = config.stocks
    const search = text.toUpperCase()
    const arr = stocks.filter((x) => x.art === search || x.artikel === search || (x.desc && x.desc.includes(search)))

    const bot = bots[0]

    const results = []

    arr.forEach((result) => (!results.find((find) => find.desc === result.desc) ? results.push(result) : ""))

    if (results.length > 1) {
      const caption = `# Nak bapak bingung kamu cari data "${text}" yang mana ya ?\n# Ini ada ${results.length} hasil pencarian bapak, kamu bantu pilih ya...\n\n🐷🐷🐷🐷🐷🐷🐷🐷🐷`

      const reply_markup = { inline_keyboard: results.map((result) => [{ text: `${result.brand} ${result.desc}`, callback_data: `SEARCH:${result.desc}` }]) }

      return await bot.telegram.sendMessage(config.group, caption, { reply_markup })
    }

    if (arr.length === 0) return await bot.telegram.sendMessage(config.group, "# Bapak tidak bisa menemukan data barang yang kamu cari nak.")

    const { result, str } = stringStock(arr, "stock")

    const reply_markup = {
      inline_keyboard: [
        [{ text: "STOCK AWAL", callback_data: `INVENTORY:inventory#${result.art}` }],
        [
          { text: "SALES", callback_data: `INVENTORY:sales#${result.art}` },
          { text: "ECOMM", callback_data: `INVENTORY:ecomm#${result.art}` },
        ],
        [
          { text: "IN", callback_data: `INVENTORY:in#${result.art}` },
          { text: "OUT", callback_data: `INVENTORY:out#${result.art}` },
        ],
      ],
    }

    if (result.shopee_id && /^\d+$/.test(result.shopee_id)) {
      reply_markup.inline_keyboard.push([{ text: `SHOPEE WITH PHOTO`, callback_data: `SHOPEE:${result.shopee_id}#${result.art}#yes` }])
      reply_markup.inline_keyboard.push([{ text: `SHOPEE WITHOUT FOTO`, callback_data: `SHOPEE:${result.shopee_id}#${result.art}#no` }])
    } else {
      reply_markup.inline_keyboard.push([{ text: "UPLOAD PRODUCT SHOPEE", url: "https://seller.shopee.co.id/portal/product/new?pageEntry=product_list" }])
    }

    reply_markup.inline_keyboard.push([{ text: "CANCEL", callback_data: "CANCEL" }])

    if (str.length >= 4096) {
      const chunks = textSpliter(str)

      for (let i = 0; i < chunks.length; i++) {
        const caption = chunks[i]

        if (i === chunks.length - 1) {
          await bot.telegram.sendMessage(config.group, caption, { reply_markup })
        } else {
          await bot.telegram.sendMessage(config.group, caption)
        }
      }
    } else {
      await bot.telegram.sendMessage(config.group, str, { reply_markup })
    }
  } catch (error) {
    console.log({ error, source: "stock handler" })
  }
}

const updateStock = async () => {
  const botindex = (config.botindex = (config.botindex % (bots.length - 1)) + 1)
  const bot = bots[botindex]

  const HPAL = new Sheets("1NvQpB2QdQHoNfk8JbLMv8NrLIKr_1VngzrDobWi8tlc", "HPAL")
  const HPAM = new Sheets("1zhtgeitq_yjFx78IXRrHZVDDS7TQb8YuqMMT-MwHkZw", "HPAM")

  const stocks = [...(await HPAL.getStock()), ...(await HPAM.getStock())]

  const brands = [...new Set(stocks.map((x) => x.brand))]
  const data = brands.map((brand) => `  - ${brand} : ${stocks.filter((y) => y.brand === brand).length} line`)

  console.log("\x1b[0m")
  console.log(`# Update stock with total ${stocks.length} data`)

  data.forEach((x) => console.log(x))
  console.log("\x1b[0m")

  if (stocks.failed) {
    let strerr = `# Gagal mendapatkan list stock barang\n\n`
    strerr += `# Error : ${update.error && update.error.message ? update.error.message : "penyebab error tidak diketahui."}\n\n<pre>${JSON.stringify(update.error)}</pre>`

    return bot.telegram.sendMessage(config.group, strerr)
  }

  config.stocks = stocks
}

const getOrders = async (counter) => {
  try {
    const product = new Shopee()
    const orders = await product.getOrders("perlu_dikirim_perlu_diproses")

    const lists = orders.filter((x) => !config.pesanan[x.card_header.order_sn])

    for (let i = 0; i < lists.length; i++) {
      const botindex = (config.botindex = (config.botindex % (bots.length - 1)) + 1)
      const bot = bots[botindex]

      const order = lists[i]

      const { card_header, item_info_group, status_info, fulfilment_info, action_info, order_ext_info, package_ext_info } = order
      const { order_sn, buyer_info } = card_header
      const { username } = buyer_info
      const { odp_url_path_query, order_id } = order_ext_info
      const { shipping_address } = package_ext_info

      const { item_info_list, message } = item_info_group
      const { fulfilment_channel_name, masked_channel_name, ship_out_mode, short_code } = fulfilment_info

      config.pesanan[order_sn] = order

      const reply_markup = { inline_keyboard: [[{ text: order_sn, url: `https://seller.shopee.co.id${odp_url_path_query}` }]] }

      const info = item_info_list.map((info) => {
        const { item_list, item_ext_info } = info

        const arr = item_list.map((list) => {
          const { name, image, description, amount, is_wholesale, inner_item_ext_info } = list
          const { item_id, model_id, is_prescription_item } = inner_item_ext_info

          let product = item_id

          console.log(`\x1b[90m`)
          console.log(`# ${order_sn}\n  ${name}\n  ${description || "NO VARIANT"}`)
          console.log(`\x1b[0m`)

          const type = "photo"
          const url = `https://down-id.img.susercontent.com/file/${image}`

          const filename = image
          const desc = description ? description.replace("Variation:", "Variation :").split(",").join(", ") : ""
          const detail = description ? `${desc} (${amount} pcs)` : `Total : ${amount} pcs`

          let caption = `# ${fulfilment_channel_name} ${ship_out_mode}\n\n# ${name}\n# ${detail}\n\n# ${order_sn}\n# ${username}`

          if (message) caption += `\n\n<pre>${message}</pre>`

          if (desc) {
            const d = desc.toUpperCase()
            const match = description.match(/\[(.*?)\]/)

            if (d.includes("HPAL") || d.includes("HPAM") || d.includes("HPC") || d.includes("HPSO") || d.includes("HPU")) caption += "\n\n@pencurilauk @Abductedby_Aliens"

            if (match) {
              const artikel = match[1].trim().split(" ")[1]
              const arr = config.stocks.filter((x) => x.art === artikel.slice(0, 7))

              const stockarr = arr
                .map((x) => x.fields.map((y, yi) => [x.artikel + y, x.stock[yi]]))
                .flat()
                .filter((x) => !x[0].includes("TOTAL"))

              const stock = Object.fromEntries(stockarr)

              if (artikel && Object.hasOwn(stock, artikel)) {
                const art = artikel.slice(0, 7)

                product = art

                reply_markup.inline_keyboard.push([{ text: `CHECK ${art}`, callback_data: `INVENTORY:stock#${art}` }])
              }
            }

            reply_markup.inline_keyboard.push([
              { text: `VIEW`, url: `https://shopee.co.id/product/24819895/${item_id}` },
              { text: `EDIT ${product}`, url: `https://seller.shopee.co.id/portal/product/${item_id}` },
            ])
          }

          return { url, type, caption, media: { source: null, filename } }
        })

        return arr
      })

      if (counter === 0) continue

      const all = info.flat().map(async (x) => {
        try {
          const { data } = await axios({ url: x.url, method: "GET", responseType: "arraybuffer" })
          x.media.source = data
        } catch (error) {
          console.log("\x1b[31m")
          console.log(`# Failed download ${x.filename}`)
          console.log(`  ${x.name}`)
          console.log("\x1b[0m")
        }

        return x
      })

      const media = await Promise.all(all)
      const arr = media.filter((x) => x.media.source)

      const extra = { caption: arr.map((x) => x.caption).join("\n\n\n"), reply_markup, disable_notification: true }

      if (message) extra.parse_mode = "HTML"

      if (arr.length === 1) {
        await bot.telegram.sendPhoto(config.group, arr[0].media, extra)
        continue
      }

      if (arr.length > 1) await bot.telegram.sendMediaGroup(config.group, arr, extra)

      await bot.telegram.sendMessage(config.group, "\n\n" + media.map((x) => x.caption).join("\n\n\n"), extra)
    }
  } catch (error) {
    console.log({ error, source: "getOrders function" })
  } finally {
    await new Promise((resolve) => setTimeout(resolve, 2 * 60 * 1000))
    getOrders(counter + 1)
  }
}

const getRandoms = (arr, count = 1) => {
  if (count < 1) return []
  if (count > arr.length) count = arr.length

  const copy = [...arr]
  const result = []

  for (let i = 0; i < count; i++) {
    const index = Math.floor(Math.random() * copy.length)
    result.push(copy[index])
    copy.splice(index, 1)
  }

  return result
}

const sendPhotos = async (media, document, start) => {
  try {
    const botindex = (config.botindex = (config.botindex % (bots.length - 1)) + 1)
    const bot = bots[botindex]

    const extra = { disable_notification: true }

    if (media.length === 1) {
      const photo = media[0]
      await bot.telegram.sendPhoto(config.group, photo.media, { ...extra, caption: photo.caption })
    }

    if (media.length > 1 && media.length < 10) bot.telegram.sendMediaGroup(config.group, media, extra)

    if (media.length > 10) {
      const max = 9

      for (let i = 0; i < media.length; i += max) {
        const slice = media.slice(i, i + max)

        const botindex = (config.botindex = (config.botindex % (bots.length - 1)) + 1)
        const bot = bots[botindex]

        await bot.telegram.sendMediaGroup(config.group, slice, extra)
      }
    }

    if (!document) return

    const bulk = []
    const zip = new JSZip()

    media.forEach((x) => {
      bulk.push(x)
      zip.file(x.file, x.media.source)
    })

    const now = Date.now()

    const caption = `# ${media[0].title} ${media[0].variant} ${now}\n\n${media[0].desc}\n\n# GENERATE TIME ${(new Date() - start) / 1000}s`
    const filename = `${media[0].title} ${media[0].variant} ${now}.zip`

    const source = await zip.generateAsync({ type: "nodebuffer" })

    await bot.telegram.sendDocument(config.group, { source, filename }, { caption })
  } catch (error) {}
}

const getPhotos = async (text) => {
  try {
    const url = new URL(text)
    const query = url.searchParams.get("q")

    if (query) {
      const photo = new Photo(text)
      const search = await photo.search(query)

      const medias = search.map(async (url) => await getPhotos(url))

      const data = await Promise.all(medias)
      return data
    }

    const photo = new Photo(text)
    const photos = await photo.generate()
    const media = await photo.downloader(photos)

    return media
  } catch (error) {
    console.log({ error, source: "getPhotos function" })
  }
}

const boostProducts = async () => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const data = config.stocks.filter((x) => x.brand === "HPAL" && /^\d+$/.test(x.shopee_id))
    const products = Array.from(new Map(data.map((item) => [item.shopee_id, item])).values())

    const shopee = new Shopee()
    const boosts = await shopee.getBoosts()

    if (boosts.failed) return setTimeout(() => boostProducts(), 10000)

    if (boosts.length < 5) {
      const random = getRandoms(products, 5 - boosts.length)

      for (const item of random) {
        const { shopee_id, desc, art } = item

        const botindex = (config.botindex = (config.botindex % (bots.length - 1)) + 1)
        const bot = bots[botindex]

        const product_id = parseInt(shopee_id)
        const boosting = await shopee.setBoost(product_id)

        const caption = `# Boost product ${desc} ${art}\n# ${product_id}\n\n# ${boosting.message || boosting.msg || "unknown boosting status"}`

        console.log("\x1b[0m")
        console.log(`# Boost product ${desc} ${art} (${product_id})`)
        console.log(`  ${boosting.message}`)
        console.log("\x1b[0m")

        await bot.telegram.sendMessage(config.group, caption, { disable_notification: true })
      }
    }

    for (let i = 0; i < boosts.length; i++) {
      const boost = boosts[i]

      const name = boost.name ? boost.name : "Unknown Product"
      const category = boost.name ? boost.detail.category_path_name_list.join(" > ") : "Category > Unknown Category"

      const find = config.boosts[boost.boostid]

      if (!find) {
        config.boosts[boost.boostid] = {
          ...boost,
          timeout: setTimeout(async () => {
            const botindex = (config.botindex = (config.botindex % (bots.length - 1)) + 1)
            const bot = bots[botindex]

            const caption = `# Boost product ${boost.name} timeout`

            delete config.boosts[boost.boostid]

            await bot.telegram.sendMessage(config.group, caption, { disable_notification: true })

            boostProducts()
          }, parseInt(boost.cool_down_seconds) * 1000),
        }
      }

      console.log("\x1b[36m")
      console.log(`# ${name}\x1b[0m > ${category}`)
      console.log(`  ${boost.boostid}`, boost.cool_down_seconds)
      console.log("\x1b[0m")
    }

    if (Object.keys(config.boosts).length < 5) setTimeout(() => boostProducts(), 10000)
  } catch (error) {
    console.log({ error, source: "boostProducts function" })
  }
}

const start = async () => {
  try {
    updateStock()
    boostProducts()

    getOrders(0)

    setInterval(() => updateStock(), 2 * 60 * 1000)

    bots.forEach(async (bot) => {
      const profile = await bot.telegram.getMe()

      console.log(`\x1b[36m# Bot ${profile.first_name} (@${profile.username}) connected\x1b[0m`)

      bot.command("boost", async (ctx) => {
        const { update, telegram, botInfo } = ctx
        const { update_id, message } = update
        const { message_id, from, chat, date, text } = message

        if (config.messageid.includes(message_id)) return
        if (!text) return

        config.messageid.unshift(message_id)

        const extra = {
          disable_notification: true,
          reply_markup: { inline_keyboard: [[{ text: "BOOST", url: `http://${config.host}:${port}` }], [{ text: "CANCEL", callback_data: "CANCEL" }]] },
        }

        await ctx.reply(`# ${timestamp()}`, extra)
      })

      bot.command("promo", async (ctx) => {
        const { update, telegram, botInfo } = ctx
        const { update_id, message } = update
        const { message_id, from, chat, date, text } = message

        if (config.messageid.includes(message_id)) return
        if (!text) return

        config.messageid.unshift(message_id)

        await ctx.replyWithChatAction("upload_document")

        const start = new Date()

        const shopee = new Shopee()
        const promos = ["HPAL", "HPAM"].map(async (z) => {
          const promos = await shopee.searchPromo(z)
          const discounts = promos.discounts.filter((x) => x.status === "SEDANG BERJALAN")

          const lists = discounts.map(async (promo) => {
            const type = promo[promo.type_key]
            const name = type.name
            const discount_id = type.discount_id

            if (promo.type === "BUNDLE") {
              const bundle = await shopee.getBundlePromo(discount_id)
              if (bundle.failed) return null

              return bundle.extinfo.itemid_list.map((model_id) => ({ name, model_id }))
            }

            if (promo.type === "DISCOUNT") {
              const prom = await shopee.getPromo(discount_id)
              if (prom.failed) return null

              return prom.discount_item_list.map((x) => x.item_id).map((model_id) => ({ name, model_id }))
            }

            return null
          })

          return (await Promise.all(lists)).flat().filter((x) => x)
        })

        const shopee_promo = (await Promise.all(promos)).flat()

        const max = { name: "", desc: "", shopee_id: "" }

        const arr = config.stocks
          .map((x) => {
            x.name = `${x.brand} ${x.desc}`
            x.shopee_id = String(x.shopee_id)

            if (x.name.length > max.name.length) max.name = x.name
            if (x.desc.length > max.desc.length) max.desc = x.desc
            if (x.shopee_id.length > max.shopee_id.length) max.shopee_id = x.shopee_id

            return x
          })
          .filter((x) => x.desc)

        const csv = arr.map((x, i) => {
          const promo = [...new Set(shopee_promo.filter((y) => y.model_id == x.shopee_id).map((y) => y.name)).values()]
          const header = "BRAND,ARTIKEL,ART,DESC,PRICELIST PROMO,SHOPEEID,SHOPEE PROMO 1,SHOPEE PROMO 2,SHOPEE PROMO 3,SHOPEE PROMO 4\n"
          const body = `${x.brand},${x.artikel},${x.art},${x.desc},${x.promo},${x.shopee_id},${promo.join(",")}`

          return i === 0 ? header + body : body
        })

        const extra = { disable_notification: true, caption: `# ${timestamp()}\n\n# GENERATE TIME ${(new Date() - start) / 1000}\n# SHOPEE PROMO VS STOCK LIST` }

        await ctx.replyWithDocument({ source: Buffer.from(csv.join("\n")), filename: `SHOPEE_PROMO_VS_STOCK_${Date.now()}.csv` }, extra)
      })

      bot.command("update", async (ctx) => {
        const { update, telegram, botInfo } = ctx
        const { update_id, message } = update
        const { message_id, from, chat, date, text } = message

        if (config.messageid.includes(message_id)) return
        if (!text) return

        config.messageid.unshift(message_id)

        await ctx.replyWithChatAction("typing")

        await updateStock()

        const brands = [...new Set(config.stocks.map((x) => x.brand))]
        const data = brands.map((brand) => `- ${brand} : ${config.stocks.filter((y) => y.brand === brand).length} line`)

        await ctx.reply(`# STOCK BERHASIL BAPAK UPDATE YA...\n\n${data.join("\n")}\n\n# TOTAL ${config.stocks.length} LINE`)
      })

      bot.command("pesanan", async (ctx) => {
        const { update, telegram, botInfo } = ctx
        const { update_id, message } = update
        const { message_id, from, chat, date, text } = message

        if (config.messageid.includes(message_id)) return
        if (!text) return

        config.messageid.unshift(message_id)

        await ctx.reply("# Sabar ya bapak cek dulu list pesanannya...", { disable_notification: true })

        const product = new Shopee()
        const orders = await product.getOrders("perlu_dikirim_perlu_diproses")

        let captionstr = `# Total ${orders.length} pesanan\n\n`

        for (let i = 0; i < orders.length; i++) {
          const order = orders[i]

          captionstr += `📌 PESANAN ${i + 1}\n\n`

          const { card_header, item_info_group, status_info, fulfilment_info, action_info, order_ext_info, package_ext_info } = order
          const { order_sn, buyer_info } = card_header
          const { username } = buyer_info
          const { odp_url_path_query, order_id } = order_ext_info
          const { shipping_address } = package_ext_info

          const { item_info_list, message } = item_info_group
          const { fulfilment_channel_name, masked_channel_name, ship_out_mode, short_code } = fulfilment_info

          item_info_list.forEach((info) => {
            const { item_list, item_ext_info } = info

            item_list.forEach((list) => {
              const { name, image, description, amount, is_wholesale, inner_item_ext_info } = list
              const { item_id, model_id, is_prescription_item } = inner_item_ext_info

              const type = "photo"
              const url = `https://down-id.img.susercontent.com/file/${image}`

              const filename = image
              const desc = description ? description.replace("Variation:", "Variation :").split(",").join(", ") : ""
              const detail = description ? `${desc} (${amount} pcs)` : `Total : ${amount} pcs`

              let caption = `# ${fulfilment_channel_name} ${ship_out_mode}\n\n# ${name}\n# ${detail}\n# ${order_sn}\n# ${username}\n\n`

              if (message) caption += `<pre>${message}</pre>\n\n`

              captionstr += caption

              return { url, type, caption, media: { source: null, filename } }
            })
          })
        }

        const extra = { disable_notification: true, parse_mode: "HTML" }

        if (captionstr.length >= 4096) {
          const chunks = textSpliter(captionstr)

          for (let i = 0; i < chunks.length; i++) {
            const caption = chunks[i]

            if (i === chunks.length - 1) {
              await bot.telegram.sendMessage(config.group, caption, extra)
            } else {
              await bot.telegram.sendMessage(config.group, caption, extra)
            }
          }
        } else {
          await bot.telegram.sendMessage(config.group, captionstr, extra)
        }
      })

      bot.on("document", async (ctx) => {
        const { update, telegram, botInfo } = ctx
        const { update_id, message } = update || {}
        const { message_id, from, chat, date, text, document } = message || {}
        const { id, is_bot, first_name, last_name, username, language_code } = from || {}
        const { file_name, mime_type, file_id, file_unique_id, file_size } = document || {}

        if (config.messageid.includes(message_id)) return
        config.messageid.unshift(message_id)

        if (mime_type.split("/")[1] !== "json") return

        await ctx.replyWithChatAction("upload_document")

        const { href, origin, protocol, host, hostname, port, pathname, search } = await ctx.telegram.getFileLink(file_id)
        const { data } = await axios({ method: "GET", url: href, responseType: "arraybuffer" })

        const { url, cookies } = JSON.parse(data.toString("utf-8"))

        if (!url || (url && !url.includes("shopee.co.id"))) return await ctx.reply("# Sepertinya cookies shopee file kamu tidak falid")

        fs.writeFileSync("cookies.json", data)

        await ctx.reply("# Data cookies shopee di update, program akan restart ya..")
        await ctx.reply("# Bapak akan bangkit lagi nanti")

        await new Promise((resolve) => setTimeout(resolve, 2000))

        exec(`pm2 flush; pm2 restart ${process.env.name}`, { timeout: 2 * 60000 })
      })

      bot.on("message", async (ctx) => {
        const { update, telegram, botInfo } = ctx
        const { update_id, message } = update || {}
        const { message_id, from, chat, date, text } = message || {}
        const { id, is_bot, first_name, last_name, username, language_code } = from || {}

        const regex = /^(https?:\/\/)?((localhost)|(\d{1,3}(\.\d{1,3}){3})|([\w-]+\.)+[\w-]+)(:\d+)?(\/.*)?$/

        if (config.messageid.includes(message_id)) return
        if (!text) return

        config.messageid.unshift(message_id)

        console.log("\x1b[0m")
        console.log(`# ${username || first_name} : ${text}`)
        console.log("\x1b[0m")

        if (text && text.toLowerCase().includes("test")) return ctx.reply("# FUCK YOU " + first_name)

        if (regex.test(text) && ["HUSHPUPPIES", "9TO9", "ZALORA"].find((x) => text.toUpperCase().includes(x))) {
          await ctx.replyWithChatAction("upload_document")

          const start = new Date()
          const media = await getPhotos(text)
          const now = Date.now()

          const url = new URL(text)
          const query = url.searchParams.get("q")

          if (Array.isArray(media[0])) {
            const zip = new JSZip()

            for (const x of media) {
              for (const y of x) {
                const { title, variant, file, media } = y
                const { source, filename } = media

                const folderPath = `${title} ${variant}`
                const folder = zip.folder(folderPath)

                folder.file(file, source)
              }

              sendPhotos(x, false, start)
            }

            const caption = `# BULK ${query.toUpperCase()} ${media.length} VARIANT ${now}\n\n# TOTAL ${media.length} RESULT\n# GENERATE TIME ${(new Date() - start) / 1000}s`
            const source = await zip.generateAsync({ type: "nodebuffer" })

            return await ctx.replyWithDocument({ source, filename: `${caption}.zip` }, { caption })
          }

          return sendPhotos(media, true, start)
        }

        searchStock(text)
      })

      bot.action(/^SEARCH:(.+)$/, async (ctx) => {
        try {
          const desc = ctx.match[1]

          const stocks = config.stocks
          const search = desc.toUpperCase()
          const arr = stocks.filter((x) => x.desc && x.desc.includes(search))

          await ctx.answerCbQuery()

          if (arr.length === 0) return await ctx.reply("# Bapak tidak bisa menemukan data barang yang kamu cari nak.")

          const { result, str } = stringStock(arr, "stock")

          const reply_markup = {
            inline_keyboard: [
              [{ text: "STOCK AWAL", callback_data: `INVENTORY:inventory#${result.art}` }],
              [
                { text: "SALES", callback_data: `INVENTORY:sales#${result.art}` },
                { text: "ECOMM", callback_data: `INVENTORY:ecomm#${result.art}` },
              ],
              [
                { text: "IN", callback_data: `INVENTORY:in#${result.art}` },
                { text: "OUT", callback_data: `INVENTORY:out#${result.art}` },
              ],
            ],
          }

          if (result.shopee_id && /^\d+$/.test(result.shopee_id)) {
            reply_markup.inline_keyboard.push([{ text: `SHOPEE WITH PHOTO`, callback_data: `SHOPEE:${result.shopee_id}#${result.art}#yes` }])
            reply_markup.inline_keyboard.push([{ text: `SHOPEE WITHOUT FOTO`, callback_data: `SHOPEE:${result.shopee_id}#${result.art}#no` }])
          } else {
            reply_markup.inline_keyboard.push([{ text: "UPLOAD PRODUCT SHOPEE", url: "https://seller.shopee.co.id/portal/product/new?pageEntry=product_list" }])
          }

          await ctx.reply(str, { reply_markup, disable_notification: true })
        } catch (error) {
          console.log({ error, source: "bot action search" })
        }
      })

      bot.action(/^UPDATE:(.+)$/, async (ctx) => {
        let [product_id, art] = ctx.match[1].split("#")

        await ctx.answerCbQuery()
        await ctx.replyWithChatAction("typing")

        const stocks = config.stocks
        const search = art.toUpperCase()
        const arr = stocks.filter((x) => x.art === search)

        const extra = { disable_notification: true }

        if (arr.length === 0) return await ctx.reply(`# Gagal update barang dengan id ${product_id} karena data tidak ditemukan pada stockan.`, extra)

        const product = new Shopee()
        const detail = await product.getDetail(product_id)

        if (detail.failed) {
          let strerr = `# Gagal mendapatkan data artikel ${art} dengan shopee id product ${product_id}\n\n`
          strerr += `# Error : ${update.error && update.error.message ? update.error.message : "penyebab error tidak diketahui."}\n\n<pre>${JSON.stringify(update.error)}</pre>`

          return await ctx.reply(strerr, { parse_mode: "HTML", ...extra })
        }

        const stockarr = arr
          .map((x) => x.fields.map((y, yi) => [x.artikel + y, x.stock[yi]]))
          .flat()
          .filter((x) => !x[0].includes("TOTAL"))

        const stock = Object.fromEntries(stockarr)

        const err = []
        const warn = []
        const logs = []

        const model_list = detail.model_list.map((model) => {
          const stock_detail = model.stock_detail
          const seller_stock_info = stock_detail.seller_stock_info

          const id = model.id
          const sku = model.sku
          const tier_index = model.tier_index

          if (!sku) err.push(`- Variant dengan id ${model.id} belum memiliki SKU`)

          const stock_setting_list = seller_stock_info.map((item) => {
            const { location_id, sellable_stock } = item

            const location = location_id === "IDZ" ? "botani" : location_id === "ID014GWYZ" ? "d-mall" : "unknown"
            const update_stock = location_id === "ID014GWYZ" ? 0 : Object.hasOwn(stock, sku) ? stock[sku] : sellable_stock

            if (sellable_stock !== update_stock) logs.push(`- Stock ${location} ${sku} update ${sellable_stock} pcs ==> ${update_stock} pcs`)
            if (!Object.hasOwn(stock, sku)) warn.push(`- Stock SKU ${sku} tidak ditemukan, stock ${location} sesuai awal ${sellable_stock} pcs.`)

            return { location_id, sellable_stock: update_stock }
          })

          return { id, tier_index, stock_setting_list, sku }
        })

        if (err.length > 0) {
          const caption = `# Tidak dapat melakukan update stock product ${detail.name}, ditemukan beberapa error fields:\n\n${err.join("\n")}`
          return ctx.reply(caption, extra)
        }

        if (logs.length === 0) {
          const caption = `# Tidak ada perubahan yang diterapkan karena stock barang dan stock shopee masih sama.`
          return ctx.reply(caption, extra)
        }

        const shopee = new Shopee()
        const update = await shopee.setStock(product_id, model_list)

        if (update.failed) {
          let strerr = `# Gagal update data stock artikel ${art} dengan shopee id product ${product_id}\n\n`
          strerr += `# Error : ${update.error && update.error.message ? update.error.message : "penyebab error tidak diketahui."}\n\n<pre>${JSON.stringify(update.error)}</pre>`

          return await ctx.reply(strerr, { parse_mode: "HTML", ...extra })
        }

        let caption = `# Berhasil update data stock product ${detail.name} dengan ${logs.length} perubahan.\n\n`
        caption += `# Logs :\n${logs.join("\n")}${warn.length > 0 ? "\n\n# Note :\n" + warn.join("\n") : ""}`

        if (caption.length >= 4096) {
          const chunks = textSpliter(caption)

          for (let i = 0; i < chunks.length; i++) {
            const caption = chunks[i]
            await ctx.reply(caption, extra)
          }
        } else {
          await ctx.reply(caption, extra)
        }
      })

      bot.action(/^SHOPEE:(.+)$/, async (ctx) => {
        const [product_id, art, photo] = ctx.match[1].split("#")

        await ctx.answerCbQuery()
        await ctx.replyWithChatAction(photo === "yes" ? "upload_photo" : "typing")

        const stocks = config.stocks
        const search = art.toUpperCase()
        const arr = stocks.filter((x) => x.art === search)

        const extra = { disable_notification: true }

        if (arr.length === 0) return await ctx.reply(`# Gagal update barang dengan id ${product_id} karena data tidak ditemukan pada stockan.`, extra)

        const product = new Shopee()
        const detail = await product.getDetail(product_id)

        if (detail.failed) {
          let strerr = `# Gagal mendapatkan detail product shopee\n\n`
          strerr += `# Error : ${detail.error && detail.error.message ? detail.error.message : "penyebab error tidak diketahui."}\n\n<pre>${JSON.stringify(detail.error)}</pre>`

          return await ctx.reply(strerr, { parse_mode: "HTML", ...extra })
        }

        if (!detail.model_list || (detail.model_list && detail.model_list.length === 0)) return await ctx.reply("# model list detail product tidak valid.")

        let str = `# ${timestamp(detail.create_time * 1000)}\n\n# ${detail.name}\n\n`

        const model = detail.model_list[0]
        const price_info = model.price_info
        const normal_price = price_info.normal_price
        const promotion_price = price_info.promotion_price

        str += `# Detail :\n\n`
        str += `- ${detail.brand_info.brand_name}  > ${detail.category_path_name_list.join(" > ")}\n`
        str += `- Product weight ${detail.weight.value}gr, pre-order ${detail.pre_order_info.pre_order}\n`
        str += `- Parrent SKU ${detail.parent_sku}\n\n`

        str += `# Price :\n\n`
        str += `- Price Rp.${currency(normal_price.split(".00").join(""))}\n`
        str += `- Promotion Price Rp.${currency(promotion_price.split(".00").join(""))}\n\n`

        if (detail.model_list.length > 0) {
          const stockarr = arr
            .map((x) => x.fields.map((y, yi) => [x.artikel + y, x.stock[yi]]))
            .flat()
            .filter((x) => !x[0].includes("TOTAL"))

          const stock = Object.fromEntries(stockarr)

          detail.model_list.forEach((model) => {
            const stock_detail = model.stock_detail
            const seller_stock_info = stock_detail.seller_stock_info
            const sku = model.sku

            const locations = seller_stock_info.map((location) => {
              const sellable_stock = location.sellable_stock

              const location_id = location.location_id
              const location_name = location.location_name

              const skuname = Object.hasOwn(stock, sku) ? sku : "NOT_FOUND"

              const inventory = location_id === "IDZ" ? (stock[sku] === undefined || stock[sku] === null ? "❌" : stock[sku]) : sellable_stock
              const text = `   ${location_name.replace("CITRUS ", "")} : ${sellable_stock} pcs <===> ${inventory} pcs ${skuname} ${sellable_stock !== inventory ? "👈" : ""}`

              return text
            })

            str += `# ${model.name.split(",").join(" ")}  (TOTAL ${stock_detail.total_available_stock} pcs)\n${locations.join("\n")}\n\n`
          })
        }

        str += "\n\n"

        const reply_markup = {
          inline_keyboard: [
            [
              { text: "LIHAT PRODUCT", url: `https://shopee.co.id/product/24819895/${detail.id}` },
              { text: "EDIT PRODUCT", url: `https://seller.shopee.co.id/portal/product/${detail.id}` },
            ],
            [{ text: "UPDATE STOCK SHOPEE", callback_data: `UPDATE:${detail.id}#${art}` }],
            [{ text: "CANCEL", callback_data: "CANCEL" }],
          ],
        }

        if (photo === "yes") {
          const arrbuffer = detail.images.map(async (x, i) => {
            let filename = x
            let caption = `# ${i + 1} ${x}`
            let type = "photo"

            let source = null

            let url = `https://down-id.img.susercontent.com/file/${x}`

            try {
              const { data } = await axios({ url, method: "GET", responseType: "arraybuffer" })

              source = data
            } catch (error) {
              console.log("\x1b[31m")
              console.log(`# Failed download ${filename}`)
              console.log("\x1b[0m")
            }

            return { type, caption, media: { source, filename } }
          })

          const data = (await Promise.all(arrbuffer)).filter((x) => x.media.source)

          await ctx.replyWithMediaGroup(data, extra)
        }

        if (str.length >= 4096) {
          const chunks = textSpliter(str)

          for (let i = 0; i < chunks.length; i++) {
            const caption = chunks[i]

            if (i === chunks.length - 1) {
              await ctx.reply(caption, { reply_markup, ...extra })
            } else {
              await ctx.reply(caption, extra)
            }
          }
        } else {
          await ctx.reply(str, { reply_markup, ...extra })
        }
      })

      bot.action(/^INVENTORY:(.+)$/, async (ctx) => {
        const [type, art] = ctx.match[1].split("#")

        await ctx.answerCbQuery()

        const stocks = config.stocks
        const search = art.toUpperCase()
        const arr = stocks.filter((x) => x.art === search)

        if (arr.length === 0) return await ctx.reply("# Bapak tidak bisa menemukan data barang yang kamu cari nak.")

        const stock = stringStock(arr, type)
        await ctx.reply(stock.str, { disable_notification: true })
      })

      bot.action("CANCEL", async (ctx) => {
        await ctx.answerCbQuery()
        await ctx.deleteMessage()
      })

      bot.launch()
    })
  } catch (error) {
    console.log({ error, source: "main function" })
  }
}

app.use(express.json({ limit: "200mb" }))
app.use(express.urlencoded({ limit: "200mb", extended: true }))

app.get("/", async (req, res) => {
  const shopee = new Shopee()
  const boosts = await shopee.getBoosts()

  const tr = boosts.map((x, i) => {
    const { id, name, cool_down_seconds, date, estimate, detail } = x

    let text = `<tr id="${id}">
                  <th scope="row">${i + 1}</th>
                  <td>${name}</td>
                  <td>${id}s</td>
                  <td class="countdown" id="${id}" countdown="${cool_down_seconds}">${cool_down_seconds}s</td>
                  <td>${estimate}</td>
                </tr>`

    return text
  })

  const html = `<!doctype html>
                <html lang="en">
                  <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <title>Shopee Boosts Product</title>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
                  </head>
                  <body style="padding: 10px">
                    <br><br>
                    <h1>Total ${boosts.length} product boosted</h1>
                    <br><br>
                    <table class="table">
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">NAME</th>
                          <th scope="col">PRODUCT ID</th>
                          <th scope="col">COUNTDOWN</th>
                          <th scope="col">ESTIMATE</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${tr.join("\n")}
                      </tbody>
                    </table>
                  </body>
                  <script>
                    const lists = document.querySelectorAll("td.countdown")

                    lists.forEach((el) => {
                      const loop = setInterval(() => {
                        const parentid = el.getAttribute("id")
                        const parent = document.getElementById(parentid)

                        const value = el.getAttribute("countdown")
                        const countdown = parseInt(value)

                        el.setAttribute("countdown", countdown - 1)
                        el.innerHTML = countdown + "s"

                        if (countdown < 0) {
                          clearInterval(loop)
                          parent.style.display = "none"
                        }
                      }, 1000)
                    })
                  </script>
                </html>`

  res.send(html)
})

app.get("/shopee/boosts", async (req, res) => {
  const shopee = new Shopee()
  const boosts = await shopee.getBoosts()

  res.json(boosts)
})

app.post("/sheets/webhook", (req, res) => {
  const { spreadsheetId, sheetName, range, value, oldValue, editedAt } = req.body

  console.log("\x1b[0m")
  console.log(req.body)
  console.log("\x1b[0m")

  if ((sheetName === "STOCK" || sheetName === "SALES") && value) {
    console.log("\x1b[36m")
    console.log("# Updating stock")
    console.log("\x1b[0m")

    updateStock()
  }

  res.json({ ok: true })
})

app.listen(port, () => {
  const nets = os.networkInterfaces()

  for (const name of Object.keys(nets)) {
    if (name === "eth0") {
      for (const net of nets[name]) {
        if (net.family === "IPv4" && !net.internal) {
          const ip = net.address

          if (!ip.startsWith("10.") && !ip.startsWith("192.168.")) config.host = ip
        }
      }
    }
  }

  console.log("\x1b[32m")
  console.log(`# Server listening on http://${config.host}:${port}`)
  console.log("\x1b[0m")

  start()
})
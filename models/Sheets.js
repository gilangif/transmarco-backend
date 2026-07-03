import { google } from "googleapis"

import fs from "fs"

import parseSheetData from "../utils/parseSheetData.js"

const transmarco = {
  type: "service_account",
  project_id: "laporan-498116",
  private_key_id: "757ad8bdce26c204b907d73b28f6dac044e57fae",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDJmmfWgd11nacz\nzJwosPNLahsPdObt7dnsQNQUIpc17Pbdkx50s9fJze8By0cABhGrK7AVg9xHKaUu\nIPlkk5GVnRHqaMWANGgKo8gnxx/Tb0rG19siXKYyOXhCgd2jTJ2UwYlEV4w70k8/\nZzet1kjFbjW/4gN3bEL59lrPxCuAe3zatP4bjJiPxmnSkAPcBQkYCic2ALIH28vI\nm7dnnmnkiwN/Nun3i1IhlPBGZSD6ZY8wNFC+StlHsarvvjvC53mFogfw45VbTpBy\nrCh0+b1pkFvdCzKZU7CQSDNsUwlmsONGQYGV3ESLU04zo9QubLda06RjoMc/ffTV\ne2f8Zo8rAgMBAAECggEACL9V9hOLo/wDmNaUVM4PIGlc/Z5MggWQYq6r0dvWXi6g\nxehv3Kk/Zn0BYj1YIILvs7k6wK3VM8YPNrstI9U+iEe/OUHAIA0mEbm3IfkcqZq3\nAeQa/zJJ7vzALRKTDVZyF+911BNNMGNMF176v+SZiVRI3MFWKSsqlMuNqsPDDdk6\nCA/+bf89g4N2nCxQV6jfdQjhTiTEJeYqxZVs55Kz6tB7kmA9QSymU3laO8EkQOGD\niUeuqSRWYu9dLFd18u6D4kMj7RDbVfN7WfKOQrPKGIRWEAo1kYDvNMLD07TvAMGN\n43PWZaizu2r+N9eOi/Tch0i9AsziChFvc0cruFickQKBgQD5G2uxkBoG78iUAXuv\nhr2YSIbwuUVWXCPkHa5GKoJbJ3fBC0yAhHElIEOVLDvuXxpBUCCWmt8lzDygUp6G\n9oLR4jNPXDe9RWZnftcb2Q3HXqq2jkyI06LTVCPEglo8DQDgCh+WZ42+L0jpEhm7\n2X8Mmb36ZSQByEfKAkz6YGK+rQKBgQDPLnwsfvtGAbVoFr+626Ix8bp1ae2H3jaH\nuLzkWNZQktWuu05NhagH5yq+I9UBBJMJNBadAOeVljxQm+oYnufpk3WndQT4bCah\nGXjFaSRj2Pu9eRGhjTeELAMbQTF9uP5iyeUuo2L2MqvKrZG69r3fiGXVUgqvl/Tj\nIqxNv1j4NwKBgFT9ngi++aJUPUMCHokMl7NVS3TmQVntpfE2jzcxWbhwBtO+XyOa\nDGB2WZiTtv7lQ7f09qlrvabPv/+TMLMreAbT/l2dQQc6nm3BQPMnYyQakHQoqMQm\nMO+ZTXrGXrMOXLYTviM6wYmZ6G5c1prY4hgSfFbqGxbgll292zWxnP8hAoGAGWnj\nU3X0Dp9RCEaaGCqu15+GNrbaqyrn13giu4PmLhYE3h0dusalWOrTRGWS0EAmZR+d\nkn606ZV3KpAlhAWh/vXWncbt6CckCejc9qIyE4lfP9uk/QMchzr62pIBpyFVGvsX\nAMSL9BU9G2x1DtELc2sAysz4gJeMM3xiVFsfZ7sCgYEAlJohLcEny1etbmeoatG9\njwt++5a55nXeR1nr9r3TrRami8aegm4kekkeRCFaS7eh1wmbFrAjouvJ8qk5xU1x\n2LKtPXejSrY758wo1IallLiDfs7Q3WzkkM5tQFn+IZ1fmzva2H6QNRRcxALmH0+9\nzeimzofrpM9pk4kbtSxWa8M=\n-----END PRIVATE KEY-----\n",
  client_id: "101543824971757668477",
  client_email: "gilangif@laporan-498116.iam.gserviceaccount.com",
  client_id: "101543824971757668477",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/transmarco%40studious-karma-439813-n7.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
}

class Sheets {
  constructor(brand) {
    const credentials = {
      HPAL: { spreadsheetId: "1tTUFuzFYl9QxP-T-8nqG4IIjak1ZDzdyKZYmFpFMV9Y", ...transmarco },
      HPAM: { spreadsheetId: "1tNr0u7TvRaktU9WeRb1DG-QFpjti9bPK7mkJIU075tE", ...transmarco },
      HPL: { spreadsheetId: "1w9aGI1gCXDZv__B2VlN0dMhTjgjiIOGwr3hAIAUDJmE", ...transmarco },
      HPM: { spreadsheetId: "1Sa_9grskuH92Copn00Arq9r2O6drka7ljOtbjWeHbxM", ...transmarco },
      HPSO: { spreadsheetId: "1SV_a0Dxn5GyIowS6fzFjdu6CORpNTdggmUx-_0fpHLg", ...transmarco },
      OBAM: { spreadsheetId: "1-hNRhuOTK_FwrPeuuz844euaE0MsB3yTSTXFoNwKtpE", ...transmarco },
      HPBL: { spreadsheetId: "wkwk", ...transmarco },
      HPBM: { spreadsheetId: "wkwk", ...transmarco },
      OBBL: { spreadsheetId: "wkwk", ...transmarco },
      OBM: { spreadsheetId: "11qK7nXyRZHDDoqXIls2W4fokTIFBdm3Z72QLTKAbUso", ...transmarco },
      PLL: { spreadsheetId: "wkwk", ...transmarco },
      OBBM: { spreadsheetId: "1lZsKW8YTQDU7QdRIJOBwViOAAV4Gke0d9-AkyIaXkfY", ...transmarco },
      OBL: { spreadsheetId: "1t0YWuUNLO8zG3xnWo19PEXDL9lsEDNnxuoKvABc4KfY", ...transmarco },
      PLM: { spreadsheetId: "171l5oS2hGlcRP6wrlUY_7CVf9Bn8D_ulfQHkDT5J9es", ...transmarco },
      CAT: { spreadsheetId: "1q2wEh7sSLGccXNcwfrubBThUxrva1pTji8u3jNApwOc", ...transmarco },
    }

    this.brand = brand
    this.spreadsheetId = credentials[brand].spreadsheetId

    this.sheets = google.sheets({ version: "v4", auth: new google.auth.GoogleAuth({ scopes: ["https://www.googleapis.com/auth/spreadsheets"], credentials: credentials[brand] }) })
  }

  async get(range) {
    const { sheets, spreadsheetId } = this
    const { data } = await sheets.spreadsheets.values.get({ spreadsheetId, range, majorDimension: "ROWS" })

    return data
  }

  async getStock() {
    try {
      const { sheets, spreadsheetId, brand } = this

      const range = "INVENTORY!A1:V2000"
      const majorDimension = "ROWS"

      const { data } = await sheets.spreadsheets.values.get({ spreadsheetId, range, majorDimension })

      const map = [
        { range: "A", key: "barcode", int: false },
        { range: "B", key: "inventory", int: true },
        { range: "C", key: "reff_code", int: false },
        { range: "D", key: "shopee_id", int: false },
        { range: "E", key: "lazada_id", int: false },
        { range: "F", key: "desc", int: false },
        { range: "G", key: "price", int: true },
        { range: "H", key: "promo_type", int: false },
        { range: "I", key: "netto", int: true },
        { range: "J", key: "promo", int: false },
        { range: "K", key: "item", int: false },
        { range: "L", key: "size", int: false },
        { range: "M", key: "barcode_alias", int: false },
        { range: "N", key: "code", int: false },
        { range: "O", key: "color", int: false },
        { range: "P", key: "", int: false },
        { range: "Q", key: "sales", int: true },
        { range: "R", key: "incoming", int: true },
        { range: "S", key: "outgoing", int: true },
        { range: "T", key: "ecomm", int: true },
        { range: "U", key: "stock_data", int: true },
        { range: "V", key: "stock", int: true },
      ]

      return parseSheetData(data.values, map, brand, "item")
    } catch (error) {
      console.log(error)
      console.log(this.brand)
    }
  }

  async getEcomm() {
    const { sheets, spreadsheetId, brand } = this

    const range = "ECOMM!A1:Q2000"
    const majorDimension = "ROWS"

    const { data } = await sheets.spreadsheets.values.get({ spreadsheetId, range, majorDimension })

    const map = [
      { range: "A", key: "date", int: false },
      { range: "B", key: "shipping_trace_number", int: false },
      { range: "C", key: "order_sn", int: false },
      { range: "D", key: "barcode", int: false },
      { range: "E", key: "qty", int: true },
      { range: "F", key: "status", int: false },
      { range: "G", key: "desc", int: false },
      { range: "H", key: "product_sku", int: false },
      { range: "I", key: "product_name", int: false },
      { range: "J", key: "product_variant", int: false },
      { range: "K", key: "product_price", int: true },
      { range: "L", key: "product_status", int: false },
      { range: "M", key: "product_item_id", int: false },
      { range: "N", key: "product_model_id", int: false },
      { range: "O", key: "product_pickup", int: false },
      { range: "P", key: "data_timestamp", int: false },
      { range: "Q", key: "note", int: false },
    ]

    return parseSheetData(data.values, map, brand, "barcode")
  }

  async append(shipping_trace_number, order_sn, barcode, qty, status, sku_variant, product_name, variant_name, order_price, status_info, item_id, model_id, shipping, timestamp, note) {
    try {
      const { sheets, spreadsheetId } = this

      const res = await sheets.spreadsheets.values.get({ spreadsheetId, range: "ECOMM!B:C" })

      const lastRow = res.data.values ? res.data.values.length : 1
      const nextRow = lastRow + 1

      const now = new Date()
      const day = String(now.getDate()).padStart(2, "0")

      const months = ["JAN", "FEB", "MAR", "APR", "MEI", "JUN", "JUL", "AGS", "SEP", "OKT", "NOV", "DES"]

      const month = months[now.getMonth()]
      const year = now.getFullYear()

      const date = `${day}-${month}-${year}`

      const values = [
        [date, shipping_trace_number, order_sn, barcode, qty, status, "", sku_variant, product_name, variant_name, order_price, status_info, item_id, model_id, shipping, timestamp, note],
      ]

      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `ECOMM!A${nextRow}:Q${nextRow}`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values,
        },
      })
    } catch (error) {
      console.log("📢[:143]: ", error)
    }
  }
}

export default Sheets

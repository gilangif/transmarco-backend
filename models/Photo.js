import * as cheerio from "cheerio"
import axios from "axios"
import fs from "fs"

function findKey(obj, targetKey) {
  if (typeof obj !== "object" || obj === null) return null

  if (Object.prototype.hasOwnProperty.call(obj, targetKey)) {
    return obj[targetKey]
  }

  for (const key in obj) {
    const result = findKey(obj[key], targetKey)
    if (result !== null) return result
  }

  return null
}

function replaceBR(text) {
  return text.replace(/<br\s*\/?>/gi, "\n")
}

class Photo {
  constructor(url, type) {
    this.url = url
    this.type = type
  }

  async zalora() {
    const { url, type } = this

    const response = await axios.get(url)
    const $ = cheerio.load(response.data)

    const thumbs = $("div.relative.shrink-0.basis-full.snap-center.snap-always img")
    const brand = $('h2 > a > [data-test-id="productBrand"]')?.text()?.trim() || "Unknown"
    const title = $('[data-test-id="productName"]')?.text().trim()
    const variant = $("span.truncate.text-sm.font-normal.leading-5.text-neutral-500")?.text().trim()

    const pricing = $(".hidden span")?.eq(1)?.text()?.trim() || "0"
    const price = parseInt(pricing.replace(".00"), "")

    const netto = 0

    let sku = ""
    let description = ""

    try {
      const json = $("#__NEXT_DATA__")?.html() || {}
      const obj = JSON.parse(json)

      const product_sku = findKey(obj, "SkuSupplierConfig")
      const product_care = findKey(obj, "Petunjuk Perawatan")
      const product_desc = findKey(obj, "ShortDescription")

      if (product_sku) sku = product_sku.split("-")[0]

      if (product_desc) description = description ? `${description}\n\nTentang Produk\n\n${replaceBR(product_desc)}` : `Tentang Produk\n\n${replaceBR(product_desc)}`
      if (product_care) description = description ? `${description}\n\nPetunjuk Perawatan:\n\n${replaceBR(product_care)}` : `Petunjuk Perawatan:\n\n${replaceBR(product_care)}`
    } catch (error) {
      console.log("# FAILED PARSE JSON OBJECT FROM HTML")
    }

    const result = { url, type, brand, sku, title, variant, description, price, netto, thumbs: [] }

    thumbs.each(async (i, el) => {
      const link = $(el)?.attr("src")?.split("format(webp)/")

      const file_url = link.length > 1 ? link[1] : link
      const file_name = `${brand}_${title.replace(/\s+/g, "-")}_${variant.replace(/\s+/g, "-")}_${i + 1}.jpg`

      result.thumbs.push({ file_url, file_name })
    })

    return result
  }

  async zaloraSearch(query) {
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

  async nineToNine() {
    const { url, type } = this

    const response = await axios.get(url)
    const $ = cheerio.load(response.data)

    const thumbs = $("li.swiper-slide.media-thumbs__item button img")
    const title = $("h1.product-title")?.text()?.trim()
    const variant = $("label.opt-label--swatch")?.attr("title") || ""

    const product_price = $("s.price__was")?.first()?.text()?.trim()
    const product_netto = $("strong.price__current")?.first()?.text().trim()

    const desc = $("div.product-spec__value")?.text()?.trim() || ""

    let brand = ""
    let sku = ""
    let description = ""

    let price = 0
    let netto = 0

    const product_sku = $("div.details-wrapper")

    if (product_sku) {
      product_sku.each((i, el) => {
        const label = $(el).find(".details__label").text().trim()

        if (label === "Brand") brand = $(el).find(".details__value")?.text()?.replace(":", "")?.trim() || ""
        if (label === "SKU") sku = $(el).find(".details__value")?.text()?.replace(":", "")?.trim() || ""
      })
    }

    if (product_price) price = parseInt(product_price.replace("Rp ", "").replace(/\./g, "") || "0")
    if (product_netto) netto = parseInt(product_netto.replace("Rp ", "").replace(/\./g, "") || "0")

    if (desc) description = description ? `${description}\n\nTentang Produk\n\n${desc}` : `Tentang Produk\n\n${desc}`

    const result = { url, type, brand, sku, title, variant, description, price, netto, thumbs: [] }

    thumbs.each(async (i, el) => {
      const link = $(el)?.attr("src")?.split("?v")

      const file_url = "https:" + (link.length > 1 ? link[0] : link)
      const file_name = `${title.replace(/\s+/g, "-")}_${variant.replace(/\s+/g, "-")}_${i + 1}.jpg`

      result.thumbs.push({ file_url, file_name })
    })

    return result
  }

  async nineToNineSearch() {
    const { url, type } = this

    const response = await axios.get(url)
    const $ = cheerio.load(response.data)

    const lists = $("div.card__media a")

    const arr = []

    lists.each((i, el) => {
      const href = $(el).attr("href")

      if (href) arr.push("https://9to9.co.id" + href)
    })

    return arr
  }

  async hushPuppies() {
    const { url, type } = this

    const response = await axios.get(url)
    const $ = cheerio.load(response.data)

    const thumbs = $("li.media-thumbs__item button img")
    const title = $("h1.product-title")?.text()?.trim() || ""
    const variant = $('input[name="template--19264871366905__main-color-option"]:checked')?.val() || ""

    const product_price = $("s.price__was")?.first()?.text()?.trim()
    const product_netto = $("strong.price__current")?.first()?.text().trim()

    const desc = $("div.product-spec__value")?.text()?.trim() || ""

    let brand = ""
    let sku = ""
    let description = ""

    let price = 0
    let netto = 0

    if (product_price) price = parseInt(product_price.replace("Rp ", "").replace(/\./g, "") || "0")
    if (product_netto) netto = parseInt(product_netto.replace("Rp ", "").replace(/\./g, "") || "0")

    if (desc) description = description ? `${description}\n\nTentang Produk\n\n${desc}` : `Tentang Produk\n\n${desc}`

    const result = { url, type, brand, sku, title, variant, description, price, netto, thumbs: [] }

    thumbs.each(async (i, el) => {
      const link = $(el)?.attr("src")?.split("?v")

      const file_url = "https:" + (link.length > 1 ? link[0] : link)
      const file_name = `${title.replace(/\s+/g, "-")}_${variant.replace(/\s+/g, "-")}_${i + 1}.jpg`

      result.thumbs.push({ file_url, file_name })
    })

    return result
  }

  async hushPuppiesSearch() {
    const { url, type } = this

    const response = await axios.get(url)
    const $ = cheerio.load(response.data)

    const lists = $("p.card__title a")

    const arr = []

    lists.each((i, el) => {
      const href = $(el).attr("href")

      if (href) arr.push("https://hushpuppies.co.id" + href)
    })

    return arr
  }

  async hanaBags() {
    const { url, type } = this

    const response = await axios.get(url)
    const $ = cheerio.load(response.data)

    const brand = "Hana Bags"
    const sku = $("span.sku")?.text() || ""
    const title = $("div.et_pb_module_inner h1")?.text() || ""
    const variant = sku.split("-")[1]
    const description = $("div.et_pb_wc_description")?.text()?.trim()

    const price = 0
    const netto = 0

    const thumbs = $("a[data-image-2x]")

    const result = { url, type, brand, sku, title, variant, description, price, netto, thumbs: [] }

    thumbs.each((i, el) => {
      const file_url = $(el).attr("data-image-2x")
      const file_name = `${title.replace(/\s+/g, "-")}_${variant.replace(/\s+/g, "-")}_${i + 1}.jpg`

      result.thumbs.push({ file_url, file_name })
    })

    return result
  }

  async hanaBagsSearch() {
    const { url, type } = this

    const response = await axios.get(url)
    const $ = cheerio.load(response.data)

    const lists = $("li.product a")

    const arr = []

    lists.each((i, el) => {
      const href = $(el).attr("href")

      if (href) arr.push(href)
    })

    return arr
  }
}

export default Photo
